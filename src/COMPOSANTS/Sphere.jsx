import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './Sphere.css'

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
  return (
    <div className="sphere-page">
      <div className="sphere-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}

export default Sphere
