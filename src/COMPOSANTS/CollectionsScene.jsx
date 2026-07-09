import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function CollectionsScene() {
  const groupRef = useRef()
  const pedestalRef = useRef()
  const shapes = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15
    }
    if (pedestalRef.current) {
      pedestalRef.current.position.y = Math.sin(t * 0.6) * 0.15
    }
    shapes.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.rotation.y = t * (0.2 + i * 0.08)
      mesh.rotation.x = Math.sin(t * 0.3 + i) * 0.1
    })
  })

  return (
    <group ref={groupRef}>
      <mesh ref={(el) => { shapes.current[0] = el }} position={[-1, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#f43f5e" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh ref={(el) => { shapes.current[1] = el }} position={[1, 0.3, 0]}>
        <coneGeometry args={[0.4, 0.7, 24]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh ref={pedestalRef} position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.2, 32]} />
        <meshStandardMaterial color="#fef3c7" metalness={0.7} roughness={0.1} />
      </mesh>
      <mesh ref={(el) => { shapes.current[2] = el }} position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.8}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.05}
        />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <directionalLight position={[-2, -1, -4]} intensity={0.4} color="#c4b5fd" />
      <pointLight position={[0, 2, 2]} intensity={0.3} color="#fbbf24" />
    </group>
  )
}

export default CollectionsScene
