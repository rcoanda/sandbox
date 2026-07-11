import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import '../styles/cosmos/Sphere.css'

function SphereMesh({ position, size, color, emissive }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.3}
          emissive={emissive}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 1.005, 24, 24]} />
        <meshBasicMaterial
          color="white"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}

function Scene() {
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-3, -2, -5]} intensity={0.5} color="#6ee7ff" />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={20}
      />

      <SphereMesh
        position={[0, 0, 0]}
        size={2}
        color="#1d4ed8"
        emissive="#3b82f6"
      />

      <group ref={satelliteRef}>
        <SphereMesh
          position={[0, 0, 0]}
          size={1}
          color="#d97706"
          emissive="#facc15"
        />
      </group>
    </>
  )
}

function Sphere() {
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

  return (
    <div className="sphere-page">
      <div
        className="sphere-canvas-wrap"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      >
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <Scene />
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

export default Sphere
