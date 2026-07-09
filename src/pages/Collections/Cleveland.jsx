import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/Cleveland.css'

const COUNT = 60
const SCALE = 4.5
const SPEED = 0.25

function generateCosmicTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const hue = Math.random() * 360
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  grad.addColorStop(0, `hsla(${hue + Math.random() * 60}, 80%, 35%, 1)`)
  grad.addColorStop(0.3, `hsla(${hue + 30 + Math.random() * 60}, 60%, 15%, 0.9)`)
  grad.addColorStop(0.7, `hsla(${hue + 60}, 40%, 8%, 0.8)`)
  grad.addColorStop(1, `hsla(0, 0%, 3%, 1)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = Math.random() * 2.5
    const a = 0.3 + Math.random() * 0.7
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`
    ctx.fill()
  }

  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = 2 + Math.random() * 4
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3)
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6)
    ctx.beginPath()
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = 'srgb'
  return texture
}

function Rect({ index, total, texture }) {
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
    const t = clock.getElapsedTime() * SPEED + phase
    const denom = 1 + Math.cos(t) * Math.cos(t)
    const x = SCALE * Math.sin(t) / denom
    const z = SCALE * Math.sin(t) * Math.cos(t) / denom

    meshRef.current.position.set(x, 0, z)

    const dx = SCALE * (Math.cos(t) * denom + Math.sin(t) * 2 * Math.cos(t) * Math.sin(t)) / (denom * denom)
    const dz = SCALE * (Math.cos(2 * t) * denom + Math.sin(t) * Math.cos(t) * 2 * Math.cos(t) * Math.sin(t)) / (denom * denom)
    meshRef.current.rotation.y = Math.atan2(dx, dz)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.65, 0.45]} />
      <meshBasicMaterial map={texture} side={2} />
    </mesh>
  )
}

function Scene({ textures }) {
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
      {textures.map((tex, i) => (
        <Rect key={i} index={i} total={textures.length} texture={tex} />
      ))}
    </group>
  )
}

function Cleveland() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const loader = new THREE.TextureLoader()

    const loadProcedural = () => {
      const tex = Array.from({ length: COUNT }, () => generateCosmicTexture())
      setTextures(tex)
      setReady(true)
    }

    fetch('https://openaccess-api.clevelandart.org/api/artworks?has_image=1&limit=60')
      .then((res) => res.json())
      .then(async (data) => {
        const urls = (data.data || [])
          .map((item) => {
            const web = item.images?.web?.url
            const print = item.images?.print?.url
            const original = web || print
            if (!original) return null
            return original.replace('https://openaccess-cdn.clevelandart.org', '/cma')
          })
          .filter(Boolean)

        if (urls.length < 10) {
          loadProcedural()
          return
        }

        const loadImage = (url) =>
          new Promise((resolve) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = () => resolve(null)
            img.src = url
          })

        const images = await Promise.all(urls.map(loadImage))
        const valid = images.filter(Boolean)

        if (valid.length < 10) {
          loadProcedural()
          return
        }

        const tex = valid.map((img) => {
          const t = new THREE.Texture(img)
          t.colorSpace = 'srgb'
          t.needsUpdate = true
          return t
        })
        setTextures(tex)
        setReady(true)
      })
      .catch(() => loadProcedural())
  }, [])

  if (!ready) return <div className="cleveland-page"><BackArrow /><CategoryMenu category="collections" /></div>

  return (
    <div className="cleveland-page">
      <BackArrow />
      <CategoryMenu category="collections" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <Scene textures={textures} />
      </Canvas>
    </div>
  )
}

export default Cleveland