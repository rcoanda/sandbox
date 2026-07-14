import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const R = 6
const W = 1.2
const N = 10
const TWIST = Math.PI
const SPEED = 0.06
const CX = R * 0.5
const CZ = R * 0.5

let paused = false

export function setPaused(v) {
  paused = v
}

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

  verts[off] = fA.pos.x - fA.binormal.x * hw
  verts[off + 1] = fA.pos.y - fA.binormal.y * hw
  verts[off + 2] = fA.pos.z - fA.binormal.z * hw

  verts[off + 3] = fA.pos.x + fA.binormal.x * hw
  verts[off + 4] = fA.pos.y + fA.binormal.y * hw
  verts[off + 5] = fA.pos.z + fA.binormal.z * hw

  verts[off + 6] = fB.pos.x - fB.binormal.x * hw
  verts[off + 7] = fB.pos.y - fB.binormal.y * hw
  verts[off + 8] = fB.pos.z - fB.binormal.z * hw

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

function RectTile({ index, texturePoolRef, tileUrlsRef, onClick }) {
  const meshRef = useRef()
  const visibleRef = useRef(true)
  const posArr = useRef(new Float32Array(18))
  const uvArr = useRef(new Float32Array([0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1]))
  const i = index

  useEffect(() => {
    const geom = meshRef.current.geometry
    geom.setAttribute('position', new THREE.BufferAttribute(posArr.current, 3))
    geom.setAttribute('uv', new THREE.BufferAttribute(uvArr.current, 2))
  }, [])

  useFrame(({ clock }) => {
    if (!paused) {
      const offset = clock.getElapsedTime() * SPEED
      const rawA = i / N + offset
      const rawB = (i + 1) / N + offset

      if (Math.floor(rawA) !== Math.floor(rawB)) {
        if (visibleRef.current) {
          visibleRef.current = false
          meshRef.current.visible = false
        }
      } else {
        if (!visibleRef.current) {
          visibleRef.current = true
          meshRef.current.visible = true
        }

        const tA = rawA % 1
        const tB = rawB % 1

        buildRect(tA, tB, posArr.current, 0)

        const geom = meshRef.current.geometry
        const pos = geom.getAttribute('position')
        pos.array.set(posArr.current)
        pos.needsUpdate = true
        geom.computeVertexNormals()
        geom.computeBoundingSphere()
      }
    }

    const pool = texturePoolRef.current
    if (pool.length > 0) {
      const period = 4
      const poolIdx = (Math.floor(clock.getElapsedTime() / period) + index) % pool.length
      const entry = pool[poolIdx]
      if (entry && meshRef.current.material.map !== entry.texture) {
        meshRef.current.material.map = entry.texture
        meshRef.current.material.needsUpdate = true
        tileUrlsRef.current[index] = entry.url
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => { paused = true }}
      onClick={() => onClick?.(index)}
    >
      <bufferGeometry />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </mesh>
  )
}

function AquatiqueScene({ texturePool, onImageClick }) {
  const texturePoolRef = useRef(texturePool || [])
  const tileUrlsRef = useRef({})

  useEffect(() => {
    texturePoolRef.current = texturePool || []
  }, [texturePool])

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    const onLeave = () => { paused = false }
    if (canvas) canvas.addEventListener('mouseleave', onLeave)
    return () => {
      if (canvas) canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const handleClick = useCallback((index) => {
    setPaused(true)
    onImageClick?.(index, tileUrlsRef.current[index] || '')
  }, [onImageClick])

  return (
    <group position={[1.5, 0, 0]}>
      {Array.from({ length: N }, (_, i) => (
        <RectTile key={i} index={i} texturePoolRef={texturePoolRef} tileUrlsRef={tileUrlsRef} onClick={handleClick} />
      ))}
    </group>
  )
}

export default AquatiqueScene
