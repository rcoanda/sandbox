import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const R = 6
const W = 1.2
const N = 30
const TWIST = Math.PI
const SPEED = 0.08
const CX = R * 0.5
const CZ = R * 0.5

const _normal = new THREE.Vector3(0, 1, 0)
const _binormal = new THREE.Vector3()

function getFrame(t, store) {
  const angle = t * Math.PI * 0.5
  store.pos.set(R * Math.cos(angle) - CX, 0, R * Math.sin(angle) - CZ)
  store.tangent.set(-Math.sin(angle), 0, Math.cos(angle)).normalize()

  _binormal.crossVectors(store.tangent, _normal).normalize()

  const ta = t * TWIST
  const cosA = Math.cos(ta)
  const sinA = Math.sin(ta)
  store.normal.set(
    _normal.x * cosA + _binormal.x * sinA,
    _normal.y * cosA + _binormal.y * sinA,
    _normal.z * cosA + _binormal.z * sinA,
  )
  store.binormal.crossVectors(store.tangent, store.normal).normalize()
}

function RectTile({ index, color }) {
  const meshRef = useRef()
  const phase = index / N
  const f = useMemo(() => ({ pos: new THREE.Vector3(), tangent: new THREE.Vector3(), normal: new THREE.Vector3(), binormal: new THREE.Vector3() }), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const m4 = useMemo(() => new THREE.Matrix4(), [])

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * SPEED + phase) % 1
    getFrame(t, f)

    m4.set(
      f.binormal.x, f.tangent.x, f.normal.x, f.pos.x,
      f.binormal.y, f.tangent.y, f.normal.y, f.pos.y,
      f.binormal.z, f.tangent.z, f.normal.z, f.pos.z,
      0, 0, 0, 1,
    )
    q.setFromRotationMatrix(m4)
    meshRef.current.position.copy(f.pos)
    meshRef.current.quaternion.copy(q)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[W, W * 0.5]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SepLine({ index }) {
  const meshRef = useRef()
  const phase = index / N
  const f = useMemo(() => ({ pos: new THREE.Vector3(), tangent: new THREE.Vector3(), normal: new THREE.Vector3(), binormal: new THREE.Vector3() }), [])
  const _q = useMemo(() => new THREE.Quaternion(), [])
  const _up = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * SPEED + phase) % 1
    getFrame(t, f)

    _q.setFromUnitVectors(_up, f.binormal)
    meshRef.current.position.copy(f.pos)
    meshRef.current.quaternion.copy(_q)
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.04, W, 0.04]} />
      <meshBasicMaterial color="white" transparent opacity={0.5} />
    </mesh>
  )
}

function RubanScene() {
  const colors = useMemo(() => {
    const c = []
    for (let i = 0; i < N; i++) {
      c.push(`hsl(${(i / N) * 360}, 70%, 55%)`)
    }
    return c
  }, [])

  return (
    <group>
      {Array.from({ length: N }, (_, i) => (
        <RectTile key={i} index={i} color={colors[i]} />
      ))}
      {Array.from({ length: N + 1 }, (_, i) => (
        <SepLine key={`l${i}`} index={i} />
      ))}
    </group>
  )
}

export default RubanScene
