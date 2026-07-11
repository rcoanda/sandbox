import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

const EARTH_MAP = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
const MOON_MAP = 'https://threejs.org/examples/textures/planets/moon_1024.jpg'

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
      const r = 30 + rng() * 100
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
      <pointsMaterial color="white" size={0.3} sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

function Earth({ size }) {
  const texture = useTexture(EARTH_MAP)
  return (
    <mesh>
      <sphereGeometry args={[size, 48, 48]} />
      <meshStandardMaterial map={texture} metalness={0.1} roughness={0.6} />
    </mesh>
  )
}

function Moon({ size }) {
  const texture = useTexture(MOON_MAP)
  return (
    <mesh>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={texture} metalness={0.05} roughness={0.8} />
    </mesh>
  )
}

function SceneCosmosSphere() {
  const satelliteRef = useRef()

  useFrame(({ clock }) => {
    if (!satelliteRef.current) return
    const t = clock.getElapsedTime()
    const radius = 2.5
    satelliteRef.current.position.x = Math.cos(t * 0.8) * radius
    satelliteRef.current.position.z = Math.sin(t * 0.8) * radius
  })

  return (
    <group scale={0.6}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -5]} intensity={0.3} color="#6ee7ff" />

      <Stars />
      <Earth size={1.5} />
      <group ref={satelliteRef}>
        <Moon size={0.7} />
      </group>
    </group>
  )
}

export default SceneCosmosSphere
