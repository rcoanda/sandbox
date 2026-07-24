import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide } from 'three'
import '../../styles/abstrait/Abstrait3D.css'

function YellowTriangle() {
  const ref = useRef()
  const isRotating = useRef(false)
  const progress = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (isRotating.current) {
      progress.current += 0.05
      ref.current.rotation.y += 0.2
      if (progress.current >= Math.PI * 2) {
        isRotating.current = false
        progress.current = 0
      }
    } else {
      ref.current.rotation.y = t * 0.2
    }
    ref.current.position.y = -2 + Math.sin(t * 1.5) * 0.4
  })

  return (
    <mesh
      ref={ref}
      position={[-6, -2, 5]}
      onClick={() => { isRotating.current = true; progress.current = 0 }}
    >
      <coneGeometry args={[7, 14, 3]} />
      <meshStandardMaterial
        color={0xffb703}
        roughness={0.2}
        metalness={0.1}
        emissive={0xffb703}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function BlueRing() {
  const ref = useRef()
  useFrame(({ clock }) => { ref.current.rotation.z = clock.getElapsedTime() * 0.02 })
  return (
    <mesh ref={ref} position={[2, 1, 0]}>
      <ringGeometry args={[11, 11.4, 64]} />
      <meshBasicMaterial color={0x4361ee} side={DoubleSide} transparent opacity={0.6} />
    </mesh>
  )
}

function BlueDisk() {
  const ref = useRef()
  useFrame(({ clock }) => { ref.current.rotation.z = -clock.getElapsedTime() * 0.015 })
  return (
    <mesh ref={ref} position={[1, 0, -2]}>
      <circleGeometry args={[9, 64]} />
      <meshStandardMaterial color={0x4cc9f0} transparent opacity={0.25} side={DoubleSide} />
    </mesh>
  )
}

function Grid() {
  const ref = useRef()
  const step = 1.5
  const size = 6
  useFrame(({ clock }) => { ref.current.rotation.z = 0.2 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05 })
  return (
    <group ref={ref} position={[10, 5, 2]}>
      {Array.from({ length: 5 }, (_, i) => (
        <group key={i}>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[new Float32Array([i * step, 0, 0, i * step, size, 0]), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="white" transparent opacity={0.6} />
          </line>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[new Float32Array([0, i * step, 0, size, i * step, 0]), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="white" transparent opacity={0.6} />
          </line>
        </group>
      ))}
      <mesh position={[step + step / 2, step + step / 2, 0.01]}>
        <planeGeometry args={[step, step]} />
        <meshBasicMaterial color={0xe63946} side={DoubleSide} />
      </mesh>
    </group>
  )
}

function DiagonalLines() {
  return (
    <>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([-25, 10, -5, 20, -15, 8]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="black" />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([-20, -12, 6, 25, 5, -3]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="black" />
      </line>
    </>
  )
}

function CosmosGroup() {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.x = -8 + Math.cos(t * 0.8) * 0.3
    ref.current.position.y = 6 + Math.sin(t * 0.6) * 0.3
    ref.current.rotation.y = t * 0.1
  })
  return (
    <group ref={ref} position={[-8, 6, 3]}>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color={0xe63946} roughness={0.5} />
      </mesh>
      <mesh position={[-4, 2, 1]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={0x4cc9f0} />
      </mesh>
    </group>
  )
}

function BackgroundBlobs() {
  return (
    <>
      <mesh position={[-15, 5, -15]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color={0x0a2540} transparent opacity={0.5} />
      </mesh>
      <mesh position={[15, -8, -15]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color={0x051c33} transparent opacity={0.6} />
      </mesh>
    </>
  )
}

function Abstrait3DScene() {
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX - window.innerWidth / 2) / 100,
        y: (e.clientY - window.innerHeight / 2) / 100,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ camera }) => {
    target.current.x += (mouse.current.x - target.current.x) * 0.05
    target.current.y += (-mouse.current.y - target.current.y) * 0.05
    camera.position.x = target.current.x * 1.5
    camera.position.y = target.current.y * 1.5
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <color attach="background" args={[0x07111e]} />
      <fog attach="fog" args={[0x07111e, 30, 100]} />
      <ambientLight color={0x1e3d59} intensity={15} />
      <pointLight position={[-10, 10, 20]} intensity={1000} color={0xffb703} distance={0} />
      <pointLight position={[50, 0, 15]} intensity={1000} color={0x4cc9f0} distance={0} />
      <BackgroundBlobs />
      <BlueDisk />
      <BlueRing />
      <YellowTriangle />
      <Grid />
      <DiagonalLines />
      <CosmosGroup />
    </>
  )
}

export default Abstrait3DScene
