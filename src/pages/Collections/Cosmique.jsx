import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/collections/Cosmique.css'

const COUNT = 60
const A = 4.5
const B = 2.2
const SPEED = 0.25

let paused = false

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

function Scene({ textures, onImageClick }) {
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

function Cosmique() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [imageUrls, setImageUrls] = useState([])
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)

  useEffect(() => {
    Promise.resolve().then(() => {
      const tex = Array.from({ length: COUNT }, () => generateCosmicTexture())
      setTextures(tex)
      setImageUrls(tex.map((t) => t.image.toDataURL()))
      setReady(true)
    })
  }, [])

  const handleImageClick = useCallback((index) => {
    paused = true
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setFlipped(false)
    paused = false
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(flipTimerRef.current)
      setFlipped(false)
    }
  }, [expandedIndex])

  if (!ready) return <div className="cosmique-page"><BackArrow /><CategoryMenu category="collections" /></div>

  return (
    <div className="cosmique-page">
      <BackArrow />
      <CategoryMenu category="collections" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <Scene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {expandedIndex !== null && imageUrls[expandedIndex] && (
        <div className="expanded-rect">
          <div
            className={'expanded-inner' + (flipped ? ' flipped' : '')}
            onMouseEnter={() => {
              flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
            }}
            onMouseMove={() => {
              if (flipped) return
              clearTimeout(flipTimerRef.current)
              flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
            }}
            onMouseLeave={() => {
              clearTimeout(flipTimerRef.current)
              setFlipped(false)
            }}
          >
            <div className="expanded-front">
              <img src={imageUrls[expandedIndex]} alt="" />
            </div>
            <div className="expanded-back">
              <span className="rect-back-title">Texture cosmique</span>
              <span className="rect-back-artist">Générée local</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Cosmique