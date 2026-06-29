import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import '../styles/Sphere.css'

const EARTH_MAP = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
const MOON_MAP = 'https://threejs.org/examples/textures/planets/moon_1024.jpg'

function Stars() {
  const [geometry] = useState(() => {
    const pos = []
    const s = []
    for (let i = 0; i < 3000; i++) {
      const r = 50 + Math.random() * 150
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos.push(
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r,
        Math.cos(phi) * r,
      )
      s.push(0.3 + Math.random() * 0.7)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3))
    g.setAttribute('size', new THREE.BufferAttribute(new Float32Array(s), 1))
    return g
  })

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="white"
        size={0.4}
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  )
}

function Earth({ size }) {
  const texture = useTexture(EARTH_MAP)

  return (
    <mesh>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.1}
        roughness={0.6}
      />
    </mesh>
  )
}

function Moon({ size }) {
  const texture = useTexture(MOON_MAP)

  return (
    <mesh>
      <sphereGeometry args={[size, 48, 48]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.05}
        roughness={0.8}
      />
    </mesh>
  )
}

function Scene({ offset }) {
  const satelliteRef = useRef()

  useFrame(({ clock }) => {
    if (!satelliteRef.current) return
    const t = clock.getElapsedTime()
    const radius = 3.5
    satelliteRef.current.position.x = Math.cos(t * 0.8) * radius
    satelliteRef.current.position.z = Math.sin(t * 0.8) * radius
  })

  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 30, 100]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-3, -2, -5]} intensity={0.3} color="#6ee7ff" />

      <Stars />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={20}
      />

      <group position={[offset.x, offset.y, 0]}>
        <Earth size={2} />

        <group ref={satelliteRef}>
          <Moon size={1} />
        </group>
      </group>
    </>
  )
}

function CosmosSphere() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return
      setPos({
        x: posStart.current.x + (e.clientX - dragStart.current.x),
        y: posStart.current.y + (e.clientY - dragStart.current.y),
      })
    }

    const handleMouseUp = () => {
      isDragging.current = false
      setDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e) => {
    isDragging.current = true
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { x: pos.x, y: pos.y }
  }

  const sceneOffset = { x: pos.x / 120, y: pos.y / -120 }

  return (
    <div className="sphere-page">
      <div className="sphere-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <Scene offset={sceneOffset} />
        </Canvas>
      </div>
      <div
        className={`sphere-handle${dragging ? ' sphere-handle--dragging' : ''}`}
        style={{ transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

export default CosmosSphere
