import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function knot3(p, q, phaseDeg, n) {
  const pts = []
  const ph = (phaseDeg * Math.PI) / 180
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * 2 * Math.PI
    const r = Math.cos(q * u) + 2
    const x0 = r * Math.cos(p * u)
    const y0 = r * Math.sin(p * u)
    const z0 = -Math.sin(q * u)
    const x = x0 * Math.cos(ph) - y0 * Math.sin(ph)
    const y = x0 * Math.sin(ph) + y0 * Math.cos(ph)
    pts.push([x, y, z0])
  }
  return pts
}

function map3(points, halfW, halfH) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const [x, y] of points) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const s = Math.min((2 * halfW) / (maxX - minX), (2 * halfH) / (maxY - minY))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return points.map(([x, y, z]) => [(x - cx) * s, (y - cy) * s, z])
}

const TUBES = [
  { id: 'tube-1', color: '#1f77b4', duration: 3.2, delay: 0, phase: 0 },
  { id: 'tube-2', color: '#2ca02c', duration: 4.1, delay: 0.6, phase: 120 },
  { id: 'tube-3', color: '#d62728', duration: 3.7, delay: 1.2, phase: 240 },
]

function makeCurve(points) {
  const pts = points.map((p) => new THREE.Vector3(p[0], p[1], p[2] ?? 0))
  return new THREE.CatmullRomCurve3(pts)
}

function Tube({ points, color }) {
  const curve = useMemo(() => makeCurve(points), [points])
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, Math.max(points.length * 6, 120), 0.13, 14, false),
    [curve, points],
  )
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.35} />
    </mesh>
  )
}

function Flow({ points, color, duration, delay }) {
  const curve = useMemo(() => makeCurve(points), [points])
  const refs = useRef([])
  const COUNT = 7

  useFrame(({ clock }) => {
    const base = ((clock.getElapsedTime() + delay) % duration) / duration
    for (let i = 0; i < COUNT; i++) {
      const t = (base - i * 0.045 + 1) % 1
      refs.current[i].position.copy(curve.getPointAt(t))
      const s = Math.max(1 - i * 0.24, 0.18)
      refs.current[i].scale.setScalar(s)
    }
  })

  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[0.22, 14, 14]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2 - i * 0.25}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function Circuit3DScene() {
  const groupRef = useRef()

  const data = useMemo(
    () =>
      TUBES.map((t) => ({
        ...t,
        points: map3(knot3(2, 3, t.phase, 240), 2.4, 2.7),
      })),
    [],
  )

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 8]} intensity={1.4} />
      <directionalLight position={[-5, -4, 6]} intensity={0.5} />
      <pointLight position={[0, 0, 6]} intensity={0.4} color="#ffffff" />

      {data.map((t) => (
        <group key={t.id}>
          <Tube points={t.points} color={t.color} />
          <Flow
            points={t.points}
            color={t.color}
            duration={t.duration}
            delay={t.delay}
          />
        </group>
      ))}
    </group>
  )
}
