import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/Ruban.css'

const COUNT = 20
const SPEED = 0.15
const TWIST_SPEED = 2

const pts = [
  [-4, -1.5],
  [-3, 1.5],
  [0, 3],
  [3, 1.5],
  [4, -1.5],
]

function catmullRom(t, p0, p1, p2, p3) {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  )
}

function dcatmullRom(t, p0, p1, p2, p3) {
  const t2 = t * t
  return 0.5 * (
    (-p0 + p2) +
    2 * (2 * p0 - 5 * p1 + 4 * p2 - p3) * t +
    3 * (-p0 + 3 * p1 - 3 * p2 + p3) * t2
  )
}

function spline(t, pts) {
  const n = pts.length
  const seg = t * (n - 1)
  const i = Math.min(Math.floor(seg), n - 2)
  const u = seg - i
  const p0 = pts[Math.max(0, i - 1)]
  const p1 = pts[i]
  const p2 = pts[i + 1]
  const p3 = pts[Math.min(n - 1, i + 2)]
  return [
    catmullRom(u, p0[0], p1[0], p2[0], p3[0]),
    catmullRom(u, p0[1], p1[1], p2[1], p3[1]),
  ]
}

function dspline(t, pts) {
  const n = pts.length
  const seg = t * (n - 1)
  const i = Math.min(Math.floor(seg), n - 2)
  const u = seg - i
  const p0 = pts[Math.max(0, i - 1)]
  const p1 = pts[i]
  const p2 = pts[i + 1]
  const p3 = pts[Math.min(n - 1, i + 2)]
  return [
    dcatmullRom(u, p0[0], p1[0], p2[0], p3[0]),
    dcatmullRom(u, p0[1], p1[1], p2[1], p3[1]),
  ]
}

function Rect({ index, total }) {
  const meshRef = useRef()
  const phase = index / total

  const color = useMemo(() => {
    const hue = (index / total) * 360
    return `hsl(${hue}, 75%, 55%)`
  }, [index, total])

  useEffect(() => {
    gsap.to(meshRef.current.scale, {
      x: 1.15 + Math.random() * 0.2,
      y: 1.15 + Math.random() * 0.2,
      duration: 0.6 + Math.random() * 0.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: Math.random(),
    })
  }, [])

  useFrame(({ clock }) => {
    const raw = clock.getElapsedTime() * SPEED + phase
    const t = raw - Math.floor(raw)

    const pos = spline(t, pts)

    meshRef.current.position.set(pos[1] * 0.4, pos[0], 0)
    meshRef.current.rotation.y = 0

    const twist = t * Math.PI * 2 * TWIST_SPEED + clock.getElapsedTime() * 0.5
    meshRef.current.rotation.z = Math.sin(twist) * 0.4
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.65, 0.45]} />
      <meshBasicMaterial color={color} side={2} />
    </mesh>
  )
}

function RubanLine() {
  const lineRef = useRef()
  const positions = useMemo(() => new Float32Array(COUNT * 3), [])

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const phase = i / COUNT
      const raw = now * SPEED + phase
      const t = raw - Math.floor(raw)
      const p = spline(t, pts)
      positions[i * 3] = p[1] * 0.4
      positions[i * 3 + 1] = p[0]
      positions[i * 3 + 2] = 0
    }
    if (lineRef.current && lineRef.current.geometry) {
      lineRef.current.geometry.attributes.position.array.set(positions)
      lineRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
    </line>
  )
}

function Scene() {
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    current.current.x += (mouse.current.x - current.current.x) * 0.04
    current.current.y += (mouse.current.y - current.current.y) * 0.04
    groupRef.current.rotation.x = current.current.y * 0.15
    groupRef.current.rotation.y = current.current.x * 0.15
  })

  return (
    <group ref={groupRef}>
      <RubanLine />
      {Array.from({ length: COUNT }, (_, i) => (
        <Rect key={i} index={i} total={COUNT} />
      ))}
    </group>
  )
}

function Ruban() {
  return (
    <div className="ruban-page">
      <BackArrow />
      <CategoryMenu category="motion" />
      <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  )
}

export default Ruban
