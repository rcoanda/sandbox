import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/Grid.css'

const ROWS = 8
const COLS = 14
const SPACING = 1.05
const CUBE_SIZE = 0.75
const OFFSET_X = ((COLS - 1) * SPACING) / 2
const OFFSET_Z = ((ROWS - 1) * SPACING) / 2
const SEL_SCALE = 3

function Cube({ position, hue, selected, selectionActive, index, onClick }) {
  const meshRef = useRef()
  const initPos = useMemo(() => [position[0], position[1], position[2]], [])
  const curPos = useRef([...initPos])
  const curScale = useRef(1)
  const curOpacity = useRef(1)

  useEffect(() => {
    gsap.fromTo(meshRef.current.scale, { x: 0, y: 0, z: 0 }, {
      x: 1, y: 1, z: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      delay: (Math.abs(position[0]) + Math.abs(position[2])) * 0.003,
    })
  }, [])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (selected) {
      curPos.current[0] += (0 - curPos.current[0]) * 0.06
      curPos.current[1] += (0 - curPos.current[1]) * 0.06
      curPos.current[2] += (0 - curPos.current[2]) * 0.06
      curScale.current += (SEL_SCALE - curScale.current) * 0.06
      curOpacity.current += (1 - curOpacity.current) * 0.06
      mesh.rotation.x = clock.getElapsedTime() * 0.4
      mesh.rotation.y = clock.getElapsedTime() * 0.6
    } else {
      curPos.current[0] += (initPos[0] - curPos.current[0]) * 0.06
      curPos.current[1] += (initPos[1] - curPos.current[1]) * 0.06
      curPos.current[2] += (initPos[2] - curPos.current[2]) * 0.06
      curScale.current += (1 - curScale.current) * 0.06
      curOpacity.current += (selectionActive ? 0 - curOpacity.current : 1 - curOpacity.current) * 0.06
    }
    mesh.position.set(curPos.current[0], curPos.current[1], curPos.current[2])
    mesh.scale.set(curScale.current, curScale.current, curScale.current)
    mesh.material.opacity = curOpacity.current
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(index) }}
    >
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <meshStandardMaterial
        color={`hsl(${hue}, 70%, 60%)`}
        roughness={0.3}
        metalness={0.1}
        transparent
        opacity={1}
      />
    </mesh>
  )
}

function Scene({ cubes, selectedIndex, onCubeClick }) {
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (selectedIndex !== null) return
    current.current.x += (mouse.current.x - current.current.x) * 0.04
    current.current.y += (mouse.current.y - current.current.y) * 0.04
    if (groupRef.current) {
      groupRef.current.rotation.x = current.current.y * 0.15
      groupRef.current.rotation.y = current.current.x * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {cubes.map((c, i) => (
        <Cube
          key={i}
          position={c.position}
          hue={c.hue}
          selected={selectedIndex === i}
          selectionActive={selectedIndex !== null}
          index={i}
          onClick={onCubeClick}
        />
      ))}
    </group>
  )
}

function Grid3D() {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const cubes = useMemo(() => {
    const result = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        result.push({
          position: [c * SPACING - OFFSET_X, 0, r * SPACING - OFFSET_Z],
          hue: Math.random() * 360,
        })
      }
    }
    return result
  }, [])

  const handleCubeClick = useCallback((index) => {
    setSelectedIndex((prev) => prev === index ? null : index)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedIndex !== null) setSelectedIndex(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  return (
    <div className="grid-page">
      <BackArrow />
      <CategoryMenu category="structure" />
      <Canvas camera={{ position: [0, 12, 12], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1} />
        <directionalLight position={[-10, 5, -10]} intensity={0.3} />
        <Scene
          cubes={cubes}
          selectedIndex={selectedIndex}
          onCubeClick={handleCubeClick}
        />
      </Canvas>
      {selectedIndex !== null && (
        <button className="close-btn" onClick={() => setSelectedIndex(null)}
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 200 }}
        >✕</button>
      )}
    </div>
  )
}

export default Grid3D
