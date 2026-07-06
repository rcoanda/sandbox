import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import '../styles/Chicago.css'

const COUNT = 30
const TRAJ_LARGEUR = 13
const TRAJ_HAUTEUR = 3
const SPEED = 0.1
const API_BASE = 'https://api.artic.edu/api/v1'
//pro.europeana.eu/page/apis
//https://corentinbernadou.com/work/ruby-campbell
const IIIF_URL = 'https://www.artic.edu/iiif/2'
const FETCH_LIMIT = 20

let cachedArtworks = null

function createTextCanvas(artwork, w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = '#e0d8c8'
  ctx.font = `bold ${Math.round(w * 0.045)}px sans-serif`
  const titleLines = wrapText(ctx, artwork.title, cx, h * 0.3, w * 0.8, Math.round(w * 0.055))
  const titleBottom = (titleLines + 1) * Math.round(w * 0.055)

  ctx.fillStyle = '#b8a88a'
  ctx.font = `${Math.round(w * 0.038)}px sans-serif`
  ctx.fillText(artwork.artist, cx, h * 0.3 + titleBottom + h * 0.05)

  ctx.fillStyle = '#9a8a72'
  ctx.font = `${Math.round(w * 0.035)}px sans-serif`
  ctx.fillText(artwork.year, cx, h * 0.3 + titleBottom + h * 0.12)

  return new THREE.CanvasTexture(canvas)
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let lines = 0
  for (const word of words) {
    const test = line + (line ? ' ' : '') + word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight)
      line = word
      lines++
    } else {
      line = test
    }
  }
  if (line) {
    ctx.fillText(line, x, y + lines * lineHeight)
    lines++
  }
  return lines
}

function Rect({ index, total, artwork, onArtworkClick }) {
  const outerRef = useRef()
  const flipRef = useRef()
  const phase = (index / total) * Math.PI * 2
  const flipTarget = useRef(0)
  const [imageTexture, setImageTexture] = useState(null)
  const [aspect, setAspect] = useState(1)

  const color = useMemo(() => `hsl(${(index / total) * 360}, 70%, 60%)`, [index, total])
  const planeSize = useMemo(() => {
    return aspect >= 1 ? [aspect, 1] : [1, 1 / aspect]
  }, [aspect])

  useEffect(() => {
    if (!artwork) return
    let cancelled = false
    const loader = new THREE.TextureLoader()
    loader.load(
      artwork.imageUrl,
      (tex) => {
        if (cancelled) return
        setImageTexture(tex)
        setAspect(tex.image.width / tex.image.height)
      },
      undefined,
      () => { }
    )
    return () => { cancelled = true }
  }, [artwork])

  const backTexture = useMemo(() => {
    if (!artwork) return null
    const w = 512
    const h = Math.round(512 / aspect)
    return createTextCanvas(artwork, w, h)
  }, [artwork, aspect])

  useEffect(() => {
    if (!outerRef.current) return
    gsap.to(outerRef.current.scale, {
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
    const x = Math.cos(t) * TRAJ_LARGEUR / 2
    const z = Math.sin(t * 2) * TRAJ_HAUTEUR / 2
    outerRef.current.position.set(x, 0, z)
    const dx = -Math.sin(t) * TRAJ_LARGEUR / 2
    const dz = Math.cos(t * 2) * TRAJ_HAUTEUR
    outerRef.current.rotation.y = Math.atan2(dx, dz)

    flipRef.current.rotation.y += (flipTarget.current - flipRef.current.rotation.y) * 0.08
  })

  const handleOver = () => { flipTarget.current = Math.PI }
  const handleOut = () => { flipTarget.current = 0 }
  const handleClick = (e) => {
    e.stopPropagation()
    if (artwork) onArtworkClick(index)
  }

  return (
    <group ref={outerRef}>
      <group ref={flipRef} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <mesh>
          <planeGeometry args={planeSize} />
          <meshBasicMaterial
            color={imageTexture ? 'white' : color}
            map={imageTexture}
          />
        </mesh>
        <mesh rotation-y={Math.PI}>
          <planeGeometry args={planeSize} />
          <meshBasicMaterial
            map={backTexture || undefined}
            transparent={!backTexture}
            opacity={backTexture ? 1 : 0}
          />
        </mesh>
      </group>
    </group>
  )
}

function Scene({ artworks, onArtworkClick }) {
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
        <Rect key={i} index={i} total={COUNT} artwork={artworks[i] || null} onArtworkClick={onArtworkClick} />
      ))}
    </group>
  )
}

function Chicago() {
  const [artworks, setArtworks] = useState(() => cachedArtworks || [])
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)
  const expandedRef = useRef(null)

  useEffect(() => {
    if (cachedArtworks) return

    let cancelled = false

    const fetchArtworks = async () => {
      try {
        const searchRes = await fetch(
          `${API_BASE}/artworks/search?q=paintings&is_public_domain=true&limit=${FETCH_LIMIT}&fields=id,title,artist_display,date_display,image_id`
        )
        const searchData = await searchRes.json()
        const items = (searchData.data || []).map(item => ({
          imageUrl: item.image_id ? `${IIIF_URL}/${item.image_id}/full/843,/0/default.jpg` : null,
          title: item.title || 'Untitled',
          artist: (item.artist_display || 'Unknown Artist').split('\n')[0].trim(),
          year: item.date_display || 'Unknown Year',
        })).filter(item => item.imageUrl)

        if (!cancelled) {
          cachedArtworks = items
          setArtworks(items)
        }
      } catch {
        /* skip */
      }
    }

    fetchArtworks()
    return () => { cancelled = true }
  }, [])

  const handleArtworkClick = useCallback((index) => {
    if (expandedIndex !== null) return
    if (!artworks[index]) return
    setExpandedIndex(index)
  }, [expandedIndex, artworks])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(flipTimerRef.current)
      setFlipped(false)
    }
  }, [expandedIndex])

  return (
    <div className="chicago-page">
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <Scene artworks={artworks} onArtworkClick={handleArtworkClick} />
      </Canvas>
      {expandedIndex !== null && artworks[expandedIndex] && (
        <div ref={expandedRef} className="expanded-rect">
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
              <img src={artworks[expandedIndex].imageUrl} alt={artworks[expandedIndex].title} />
            </div>
            <div className="expanded-back">
              <span className="rect-back-title">{artworks[expandedIndex].title}</span>
              <span className="rect-back-artist">{artworks[expandedIndex].artist}</span>
              <span className="rect-back-year">{artworks[expandedIndex].year}</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Chicago
