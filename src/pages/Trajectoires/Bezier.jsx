import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/trajectoires/Bezier.css'

const COUNT = 60
const RAYON = 0.18
const SPEED = 0.10

const P0 = [-8, 0, 5]
const P1 = [-8, 0, -8]
const P2 = [8, 0, 8]
const P3 = [8, 0, -5]

function bezier(t) {
  const u = 1 - t
  const u2 = u * u
  const t2 = t * t
  return [
    u2 * u * P0[0] + 3 * u2 * t * P1[0] + 3 * u * t2 * P2[0] + t2 * t * P3[0],
    0,
    u2 * u * P0[2] + 3 * u2 * t * P1[2] + 3 * u * t2 * P2[2] + t2 * t * P3[2],
  ]
}

function dbezier(t) {
  const u = 1 - t
  return [
    -3 * u * u * P0[0] + 3 * u * (1 - 3 * t) * P1[0] + 3 * t * (2 - 3 * t) * P2[0] + 3 * t * t * P3[0],
    0,
    -3 * u * u * P0[2] + 3 * u * (1 - 3 * t) * P1[2] + 3 * t * (2 - 3 * t) * P2[2] + 3 * t * t * P3[2],
  ]
}

function Bille({ index, total }) {
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

    const pos = bezier(t)
    meshRef.current.position.set(pos[0], 0, pos[2])
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[RAYON, 24, 24]} />
      <meshBasicMaterial color={color} />
    </mesh>
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
      {Array.from({ length: COUNT }, (_, i) => (
        <Bille key={i} index={i} total={COUNT} />
      ))}
    </group>
  )
}

function Bezier() {
  return (
    <div className="bezier-page">
      <BackArrow />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 5, 14], fov: 50 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  )
}

export default Bezier
