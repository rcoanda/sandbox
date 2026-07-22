import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'


const A = 4.5
const B = 2.2
const SPEED = 0.25

let paused = false

export function setPaused(v) { paused = v }

function Rect({ index, total, texture, onClick }) {
  const meshRef = useRef()
  const phase = (index / total) * Math.PI * 2

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
    if (paused) return
    const t = clock.getElapsedTime() * SPEED + phase
    const x = Math.cos(t) * A
    const z = Math.sin(t) * B

    meshRef.current.position.set(x, 0, z)

    const dx = -Math.sin(t) * A
    const dz = Math.cos(t) * B
    meshRef.current.rotation.y = Math.atan2(dx, dz)
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => { paused = true }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      <planeGeometry args={[0.65, 0.45]} />
      <meshBasicMaterial map={texture} side={2} />
    </mesh>
  )
}

export default function Scene({ textures, onImageClick }) {
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
    const onMouseLeaveCanvas = () => { paused = false }
    const canvas = document.querySelector('canvas')
    if (canvas) canvas.addEventListener('mouseleave', onMouseLeaveCanvas)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (canvas) canvas.removeEventListener('mouseleave', onMouseLeaveCanvas)
    }
  }, [])

  useFrame(() => {
    if (paused) return
    current.current.x += (mouse.current.x - current.current.x) * 0.04
    current.current.y += (mouse.current.y - current.current.y) * 0.04
    groupRef.current.rotation.x = current.current.y * 0.15
    groupRef.current.rotation.y = current.current.x * 0.15
  })

  return (
    <group ref={groupRef}>
      {textures.map((tex, i) => (
        <Rect key={i} index={i} total={textures.length} texture={tex} onClick={() => onImageClick(i)} />
      ))}
    </group>
  )
}
