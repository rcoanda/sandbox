import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function AbstraitScene() {
  const knotRef = useRef()
  const blobRef = useRef()
  const timeRef = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    timeRef.current = t
    if (knotRef.current) {
      knotRef.current.rotation.x = t * 0.4
      knotRef.current.rotation.y = t * 0.6
    }
    if (blobRef.current) {
      const s = 1 + Math.sin(t * 0.5) * 0.15
      blobRef.current.scale.set(s, s, s)
      blobRef.current.position.y = Math.sin(t * 0.8) * 0.3
    }
  })

  return (
    <>
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />
        <meshStandardMaterial
          color="#d946ef"
          metalness={0.6}
          roughness={0.2}
          emissive="#a21caf"
          emissiveIntensity={0.1}
          wireframe={false}
        />
      </mesh>
      <mesh ref={blobRef} position={[0, -1.2, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#22d3ee"
          metalness={0.3}
          roughness={0.4}
          emissive="#0891b2"
          emissiveIntensity={0.1}
        />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 3, 5]} intensity={1.5} />
      <directionalLight position={[-3, -1, -4]} intensity={0.4} color="#d946ef" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#22d3ee" />
    </>
  )
}

export default AbstraitScene
