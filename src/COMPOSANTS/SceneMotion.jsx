import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function SceneMotion() {
  const sphereRef = useRef()
  const ringRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(t * 1.5) * 0.5
      sphereRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1)
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.6
      ringRef.current.rotation.z = t * 0.4
    }
  })

  return (
    <>
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#f43f5e" metalness={0.3} roughness={0.4} emissive="#e11d48" emissiveIntensity={0.1} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1, 0.05, 16, 48]} />
        <meshBasicMaterial color="#fda4af" transparent opacity={0.5} />
      </mesh>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#f43f5e" />
    </>
  )
}

export default SceneMotion
