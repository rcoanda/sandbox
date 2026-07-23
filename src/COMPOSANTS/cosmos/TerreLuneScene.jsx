import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

import earthMap from '../../assets/cosmos/earth_texture.jpg'
import moonMap from '../../assets/cosmos/moon_texture.jpg'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function Stars({ spread = 100, size = 0.3 }) {
  const positions = useMemo(() => {
    const pos = []
    const rng = seededRandom(42)
    for (let i = 0; i < 2000; i++) {
      const r = 20 + rng() * spread
      const theta = rng() * Math.PI * 2
      const phi = Math.acos(2 * rng() - 1)
      pos.push(
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r,
        Math.cos(phi) * r,
      )
    }
    return new Float32Array(pos)
  }, [spread])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="white" size={size} sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

function Earth({ size }) {
  const texture = useTexture(earthMap)
  return (
    <mesh>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={texture} metalness={0.1} roughness={0.6} />
    </mesh>
  )
}

function Moon({ size }) {
  const texture = useTexture(moonMap)
  return (
    <mesh>
      <sphereGeometry args={[size, 48, 48]} />
      <meshStandardMaterial map={texture} metalness={0.05} roughness={0.8} />
    </mesh>
  )
}

function TerreLuneScene() {
  const satelliteRef = useRef()

  useFrame(({ clock }) => {
    if (!satelliteRef.current) return
    const t = clock.getElapsedTime()
    const radius = 3.5
    satelliteRef.current.position.x = Math.cos(t * 0.8) * radius
    satelliteRef.current.position.z = Math.sin(t * 0.8) * radius
  })

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-3, -2, -5]} intensity={0.3} color="#6ee7ff" />

      <Stars />
      <Earth size={2} />
      <group ref={satelliteRef}>
        <Moon size={1} />
      </group>
    </group>
  )
}

export default TerreLuneScene
