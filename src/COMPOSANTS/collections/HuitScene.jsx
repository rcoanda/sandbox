import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SHAPE_TYPES = ['circle', 'triangle', 'square', 'diamond', 'hexagon']

function createShapeGeometry(type, size) {
  const shape = new THREE.Shape()
  if (type === 'circle') {
    shape.absarc(0, 0, size, 0, Math.PI * 2)
  } else if (type === 'triangle') {
    const r = size
    shape.moveTo(0, r)
    shape.lineTo(r * -0.866, r * -0.5)
    shape.lineTo(r * 0.866, r * -0.5)
    shape.closePath()
  } else if (type === 'square') {
    shape.moveTo(-size, -size)
    shape.lineTo(size, -size)
    shape.lineTo(size, size)
    shape.lineTo(-size, size)
    shape.closePath()
  } else if (type === 'diamond') {
    shape.moveTo(0, size)
    shape.lineTo(size, 0)
    shape.lineTo(0, -size)
    shape.lineTo(-size, 0)
    shape.closePath()
  } else if (type === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      const px = Math.cos(angle) * size
      const py = Math.sin(angle) * size
      i === 0 ? shape.moveTo(px, py) : shape.lineTo(px, py)
    }
    shape.closePath()
  }
  return new THREE.ShapeGeometry(shape)
}

const COLORS = ['#f43f5e', '#8b5cf6', '#fbbf24', '#06b6d4', '#ec4899']
const SIZES = [0.25, 0.2, 0.3, 0.22, 0.28]

const LEMNI_SCALE = 2.5
const POINTS = Array.from({ length: 80 }, (_, i) => {
  const t = (i / 80) * Math.PI * 2
  const denom = 1 + Math.cos(t) * Math.cos(t)
  const x = LEMNI_SCALE * Math.sin(t) / denom
  const z = LEMNI_SCALE * Math.sin(t) * Math.cos(t) / denom
  return new THREE.Vector3(x, 0, z)
})

function Ribbon() {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(POINTS, true), [])
  const ribbonRef = useRef()
  const timeRef = useRef(0)

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.04, 8, true)
  }, [curve])

  useFrame((_, delta) => {
    timeRef.current += delta * 0.4
    if (ribbonRef.current) {
      ribbonRef.current.material.opacity = 0.5 + Math.sin(timeRef.current * 0.5) * 0.15
    }
  })

  return (
    <mesh ref={ribbonRef} geometry={tubeGeo}>
      <meshStandardMaterial
        color="#d97706"
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function FloatingShapes() {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(POINTS, true), [])
  const meshRefs = useRef([])

  const shapes = useMemo(() => {
    return SHAPE_TYPES.map((type, i) => ({
      geo: createShapeGeometry(type, SIZES[i]),
      color: COLORS[i],
      speed: 0.08 + Math.random() * 0.06,
      offset: (i / SHAPE_TYPES.length) * Math.PI * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const s = shapes[i]
      const progress = (t * s.speed + s.offset) % 1
      const point = curve.getPoint(progress)
      const tangent = curve.getTangent(progress)
      const up = new THREE.Vector3(0, 1, 0)
      const quat = new THREE.Quaternion().setFromUnitVectors(up, tangent)

      mesh.position.copy(point)
      mesh.quaternion.copy(quat)
      mesh.rotation.z = t * 0.5 + s.offset
      const scale = 1 + Math.sin(t * 1.2 + s.offset) * 0.15
      mesh.scale.setScalar(scale)
    })
  })

  return (
    <group>
      {shapes.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          geometry={s.geo}
        >
          <meshStandardMaterial
            color={s.color}
            metalness={0.3}
            roughness={0.2}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

function HuitScene() {
  return (
    <group rotation-x={-0.5} rotation-y={0.3}>
      <Ribbon />
      <FloatingShapes />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <directionalLight position={[-2, -1, -4]} intensity={0.4} color="#fde68a" />
      <pointLight position={[0, 2, 2]} intensity={0.3} color="#fbbf24" />
    </group>
  )
}

export default HuitScene
