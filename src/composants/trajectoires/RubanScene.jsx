import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const R = 7
const W = 1.2
const N = 10
const TWIST = Math.PI
const SPEED = 0.06
const CX = R * 0.5
const CZ = R * 0.5

const _normal = new THREE.Vector3(0, 1, 0)
const _binormal = new THREE.Vector3()

function getFrame(t) {
  const angle = t * Math.PI * 0.5 * (N + 1) / N
  const yRaise = 2.5
  const pos = new THREE.Vector3(R * Math.cos(angle) - CX, yRaise * (1 - t), R * Math.sin(angle) - CZ)
  const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize()

  _binormal.crossVectors(tangent, _normal).normalize()

  const ta = t < 1 / N ? 0 : (t - 1 / N) / (1 - 1 / N) * TWIST
  const cosA = Math.cos(ta)
  const sinA = Math.sin(ta)
  const nTw = new THREE.Vector3(
    _normal.x * cosA + _binormal.x * sinA,
    _normal.y * cosA + _binormal.y * sinA,
    _normal.z * cosA + _binormal.z * sinA,
  )
  const bTw = new THREE.Vector3().crossVectors(tangent, nTw).normalize()

  return { pos, tangent, normal: nTw, binormal: bTw }
}

function buildRect(tA, tB, verts, off) {
  const fA = getFrame(tA)
  const fB = getFrame(tB)

  const hw = W * 0.5

  // triangle 1: leftA, rightA, leftB
  verts[off] = fA.pos.x - fA.binormal.x * hw
  verts[off + 1] = fA.pos.y - fA.binormal.y * hw
  verts[off + 2] = fA.pos.z - fA.binormal.z * hw

  verts[off + 3] = fA.pos.x + fA.binormal.x * hw
  verts[off + 4] = fA.pos.y + fA.binormal.y * hw
  verts[off + 5] = fA.pos.z + fA.binormal.z * hw

  verts[off + 6] = fB.pos.x - fB.binormal.x * hw
  verts[off + 7] = fB.pos.y - fB.binormal.y * hw
  verts[off + 8] = fB.pos.z - fB.binormal.z * hw

  // triangle 2: rightA, rightB, leftB
  verts[off + 9] = fA.pos.x + fA.binormal.x * hw
  verts[off + 10] = fA.pos.y + fA.binormal.y * hw
  verts[off + 11] = fA.pos.z + fA.binormal.z * hw

  verts[off + 12] = fB.pos.x + fB.binormal.x * hw
  verts[off + 13] = fB.pos.y + fB.binormal.y * hw
  verts[off + 14] = fB.pos.z + fB.binormal.z * hw

  verts[off + 15] = fB.pos.x - fB.binormal.x * hw
  verts[off + 16] = fB.pos.y - fB.binormal.y * hw
  verts[off + 17] = fB.pos.z - fB.binormal.z * hw
}

function buildSep(t, verts, off) {
  const f = getFrame(t)
  const hw = W * 0.5

  verts[off] = f.pos.x - f.binormal.x * hw
  verts[off + 1] = f.pos.y - f.binormal.y * hw
  verts[off + 2] = f.pos.z - f.binormal.z * hw

  verts[off + 3] = f.pos.x + f.binormal.x * hw
  verts[off + 4] = f.pos.y + f.binormal.y * hw
  verts[off + 5] = f.pos.z + f.binormal.z * hw
}

function RectTile({ index, color }) {
  const meshRef = useRef()
  const visibleRef = useRef(true)
  const i = index

  useFrame(({ clock }) => {
    const offset = clock.getElapsedTime() * SPEED
    const rawA = i / N + offset
    const rawB = (i + 1) / N + offset

    if (Math.floor(rawA) !== Math.floor(rawB)) {
      if (visibleRef.current) {
        visibleRef.current = false
        meshRef.current.visible = false
      }
      return
    }

    if (!visibleRef.current) {
      visibleRef.current = true
      meshRef.current.visible = true
    }

    const tA = rawA % 1
    const tB = rawB % 1

    const verts = new Float32Array(18)
    buildRect(tA, tB, verts, 0)

    const geom = meshRef.current.geometry
    geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    geom.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef}>
      <bufferGeometry />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SepLine({ index }) {
  const ref = useRef()
  const i = index

  useFrame(({ clock }) => {
    const t = (i / N + clock.getElapsedTime() * SPEED) % 1
    const verts = new Float32Array(6)
    buildSep(t, verts, 0)

    const geom = ref.current.geometry
    geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
  })

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="white" transparent opacity={0.5} />
    </line>
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
    <group position={[1.5, 0, 0]}>
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
