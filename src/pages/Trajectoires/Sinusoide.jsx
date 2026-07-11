import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/trajectoires/Sinusoide.css'

const COUNT = 60
const A = 4.5
const B = 2.5
const SPEED = 0.8

function Rect({ index, total }) {
  const meshRef = useRef()
  const phase = (index / total) * Math.PI * 2

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
    const t = clock.getElapsedTime() * SPEED
    const x = (phase / Math.PI - 1) * A
    const z = B * Math.sin(t + phase)

    meshRef.current.position.set(x, 0, z)

    const dz = B * Math.cos(t + phase)
    meshRef.current.rotation.y = Math.atan2(0, dz)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.65, 0.45]} />
      <meshBasicMaterial color={color} side={2} />
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
        <Rect key={i} index={i} total={COUNT} />
      ))}
    </group>
  )
}

function Sinusoide() {
  return (
    <div className="sinusoide-page">
      <BackArrow />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  )
}

export default Sinusoide
