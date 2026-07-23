import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function LevitationScene() {
  const groupRef = useRef()
  const shapes = useRef([])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.2
    groupRef.current.rotation.y = t * 0.3
    shapes.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.rotation.x = t * (0.5 + i * 0.1)
      mesh.rotation.z = t * (0.3 + i * 0.15)
    })
  })

  return (
    <group ref={groupRef}>
      <mesh ref={(el) => { shapes.current[0] = el }} position={[-1.2, 0.8, 0]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh ref={(el) => { shapes.current[1] = el }} position={[1.3, -0.7, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial color="#ec4899" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh ref={(el) => { shapes.current[2] = el }} position={[-1.1, -0.9, 0]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh ref={(el) => { shapes.current[3] = el }} position={[1.4, 0.9, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.3} roughness={0.3} />
      </mesh>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-3, -2, -5]} intensity={0.5} color="#a78bfa" />
    </group>
  )
}

export default LevitationScene
