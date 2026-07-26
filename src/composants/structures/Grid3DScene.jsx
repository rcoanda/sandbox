import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const CUBE_SIZE = 0.75
const SEL_SCALE = 3

function Cube({ position, hue, selected, selectionActive, index, onClick }) {
  const meshRef = useRef()
  const initPos = useMemo(() => [position[0], position[1], position[2]], [position])
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
  }, [position])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (selected) {
      curPos.current[0] += (0 - curPos.current[0]) * 0.06
      curPos.current[1] += (0 - curPos.current[1]) * 0.06
      curPos.current[2] += (0 - curPos.current[2]) * 0.06
      curScale.current += (SEL_SCALE - curScale.current) * 0.06
      curOpacity.current += (1 - curOpacity.current) * 0.06
      mesh.material.transparent = curOpacity.current < 0.999
      mesh.rotation.x = clock.getElapsedTime() * 0.4
      mesh.rotation.y = clock.getElapsedTime() * 0.6
    } else {
      curPos.current[0] += (initPos[0] - curPos.current[0]) * 0.06
      curPos.current[1] += (initPos[1] - curPos.current[1]) * 0.06
      curPos.current[2] += (initPos[2] - curPos.current[2]) * 0.06
      curScale.current += (1 - curScale.current) * 0.06
      curOpacity.current += (selectionActive ? 0 - curOpacity.current : 1 - curOpacity.current) * 0.06
      mesh.material.transparent = curOpacity.current < 0.999
      mesh.rotation.x += (0 - mesh.rotation.x) * 0.06
      mesh.rotation.y += (0 - mesh.rotation.y) * 0.06
    }
    mesh.position.set(curPos.current[0], curPos.current[1], curPos.current[2])
    mesh.scale.set(curScale.current, curScale.current, curScale.current)
    mesh.material.opacity = curOpacity.current
  })

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => { e.stopPropagation(); onClick(index) }}
    >
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <meshStandardMaterial
        color={`hsl(${hue}, 70%, 60%)`}
        roughness={0.3}
        metalness={0.1}
        transparent={false}
        opacity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Grid3DScene({ cubes, selectedIndex, onCubeClick }) {
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const saved = useRef(null)

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

  useEffect(() => {
    if (selectedIndex !== null) {
      saved.current = { ...current.current }
    }
  }, [selectedIndex])

  useFrame(() => {
    if (selectedIndex !== null) {
      current.current.x += (mouse.current.x - current.current.x) * 0.04
      current.current.y += (mouse.current.y - current.current.y) * 0.04
    } else if (saved.current) {
      current.current.x += (saved.current.x - current.current.x) * 0.04
      current.current.y += (saved.current.y - current.current.y) * 0.04
      if (Math.abs(current.current.x - saved.current.x) < 0.001 && Math.abs(current.current.y - saved.current.y) < 0.001) {
        saved.current = null
      }
    } else {
      current.current.x += (mouse.current.x - current.current.x) * 0.04
      current.current.y += (mouse.current.y - current.current.y) * 0.04
    }
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

export default Grid3DScene
