import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Scene3D() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
    groupRef.current.rotation.y = t * 0.5
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.7, 0.25, 24, 48]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} />
      <directionalLight position={[-2, -1, -3]} intensity={0.4} color="#06b6d4" />
    </group>
  )
}

export default Scene3D
