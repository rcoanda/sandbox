import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }

}

function Stars() {
  const positions = useMemo(() => {
    const pos = []
    const rng = seededRandom(42)
    for (let i = 0; i < 2000; i++) {
      const r = 20 + rng() * 50
      const theta = rng() * Math.PI * 2
      const phi = Math.acos(2 * rng() - 1)
      pos.push(
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r,
        Math.cos(phi) * r,
      )
    }
    return new Float32Array(pos)
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.15} sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

function CosmosScene() {
  const planetRef = useRef()
  const ringRef = useRef()
  const moonRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.2
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.1) * 0.2
      ringRef.current.rotation.z = t * 0.15
    }
    if (moonRef.current) {
      const radius = 2.5
      moonRef.current.position.x = Math.cos(t * 0.6) * radius
      moonRef.current.position.z = Math.sin(t * 0.6) * radius
    }
  })

  return (
    <>
      <Stars />
      <mesh ref={planetRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 48, 48]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.2}
          roughness={0.7}
          emissive="#818cf8"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[0.4, 0, 0]}>
        <ringGeometry args={[1.3, 2, 64]} />
        <meshBasicMaterial color="#a5b4fc" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} metalness={0.05} />
      </mesh>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <directionalLight position={[-2, -1, -3]} intensity={0.3} color="#818cf8" />
    </>
  )
}

export default CosmosScene
