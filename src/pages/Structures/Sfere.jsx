import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/Sfere.css'

const RADIUS = 2
const COUNT = 120
const SIZE = 0.25

const elements = Array.from({ length: COUNT }, (_, i) => {
  const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT)
  const theta = Math.PI * (1 + Math.sqrt(5)) * i
  const x = Math.sin(phi) * Math.cos(theta)
  const y = Math.sin(phi) * Math.sin(theta)
  const z = Math.cos(phi)
  const hue = Math.random() * 360
  return {
    pos: [x * RADIUS, y * RADIUS, z * RADIUS],
    color: `hsl(${hue}, 80%, 60%)`,
    quat: new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(x, y, z).normalize()
    ),
  }
})

function PetitElement({ pos, color, quat }) {
  return (
    <mesh position={pos} quaternion={quat}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  )
}

function Sphere3D() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = t * 0.4
    groupRef.current.rotation.y = t * 0.6
  })

  return (
    <group ref={groupRef}>
      {elements.map((el, i) => (
        <PetitElement key={i} pos={el.pos} color={el.color} quat={el.quat} />
      ))}
    </group>
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
      <Sphere3D />
    </group>
  )
}

function Sfere() {
  return (
    <div className="sfere-page">
      <BackArrow />
      <CategoryMenu category="structure" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Scene />
      </Canvas>
    </div>
  )
}

export default Sfere
