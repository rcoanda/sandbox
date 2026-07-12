import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/collections/Cooper.css'
import Informations from '../../composants/Informations'

const RADIUS = 2
const COUNT = 120
const SIZE = 0.25
const DELAY_BETWEEN_IMAGES = 1000
let paused = false

const sphereElements = Array.from({ length: COUNT }, (_, i) => {
  const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT)
  const theta = Math.PI * (1 + Math.sqrt(5)) * i
  const x = Math.sin(phi) * Math.cos(theta)
  const y = Math.sin(phi) * Math.sin(theta)
  const z = Math.cos(phi)
  return {
    pos: [x * RADIUS, y * RADIUS, z * RADIUS],
    quat: new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(x, y, z).normalize()
    ),
  }
})

function PetitCube({ pos, quat, texture, onClick }) {
  return (
    <group position={pos} quaternion={quat}>
      <mesh
        onPointerOver={() => { paused = true }}
        onPointerOut={() => { paused = false }}
        onClick={(e) => { e.stopPropagation(); if (onClick) onClick() }}
      >
        <boxGeometry args={[SIZE, SIZE, SIZE]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.3}
          metalness={0.1}
          color={texture ? undefined : '#333'}
        />
      </mesh>
    </group>
  )
}

function Sphere3D({ textures, onImageClick }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (paused) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = t * 0.4
    groupRef.current.rotation.y = t * 0.6
  })

  return (
    <group ref={groupRef}>
      {sphereElements.map((el, i) => (
        <PetitCube
          key={i}
          pos={el.pos}
          quat={el.quat}
          texture={textures[i]}
          onClick={() => onImageClick(i)}
        />
      ))}
    </group>
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
    const onLeave = () => { paused = false }
    const canvas = document.querySelector('canvas')
    if (canvas) canvas.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (canvas) canvas.removeEventListener('mouseleave', onLeave)
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
      <Sphere3D textures={textures} onImageClick={onImageClick} />
    </group>
  )
}

function proxyImg(url) {
  return url && url.includes('ciim-static-media.s3.us-east-1.amazonaws.com')
    ? url.replace('https://ciim-static-media.s3.us-east-1.amazonaws.com', '/cooper-img')
    : url
}

function preloadTexture(url) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(proxyImg(url), (t) => resolve(t), undefined, () => resolve(null))
  })
}

const COOPER_QUERY = `{
  object(hasImages: true, size: 120) {
    id
    summary
    date
    multimedia
    agent { summary }
  }
}`

function fetchCooperObjects() {
  return fetch('/cooper-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: COOPER_QUERY }),
  })
    .then(r => r.json())
    .then(d => (d.data || {}).object || [])
}

function Cooper() {
  const [textures, setTextures] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [artworkMetas, setArtworkMetas] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)
  const swapCancelled = useRef(false)

  useEffect(() => {
    fetchCooperObjects().then((items) => {
      const valid = items.filter((item) => {
        const media = item.multimedia || []
        return media.length > 0 && media[0].preview && media[0].preview.url
      })
      if (valid.length >= COUNT) {
        const selected = valid.slice(0, COUNT)
        setImageUrls(selected.map((item) => proxyImg(item.multimedia[0].preview.url)))
        setArtworkMetas(selected.map((item) => ({
          title: (item.summary && item.summary.title) || 'Untitled',
          artist: (item.agent && item.agent[0] && item.agent[0].summary && item.agent[0].summary.title) || 'Unknown Designer',
          year: (item.date && item.date[0] && item.date[0].value) || 'Unknown Year',
        })))
        Promise.all(
          selected.map((item) => preloadTexture(item.multimedia[0].preview.url))
        ).then(setTextures)
      }
    })
  }, [])

  useEffect(() => {
    if (textures.length < COUNT) return
    swapCancelled.current = false

    const swapLoop = async () => {
      while (!swapCancelled.current) {
        const idx = Math.floor(Math.random() * COUNT)
        try {
          const items = await fetchCooperObjects()
          const item = items.find((i) => {
            const media = i.multimedia || []
            return media.length > 0 && media[0].preview && media[0].preview.url
          })
            if (item && !swapCancelled.current) {
            const url = proxyImg(item.multimedia[0].preview.url)
            const tex = await preloadTexture(url)
            if (!swapCancelled.current) {
              setImageUrls((prev) => {
                const next = [...prev]
                next[idx] = url
                return next
              })
              setArtworkMetas((prev) => {
                const next = [...prev]
                next[idx] = {
                  title: (item.summary && item.summary.title) || 'Untitled',
                  artist: (item.agent && item.agent[0] && item.agent[0].summary && item.agent[0].summary.title) || 'Unknown Designer',
                  year: (item.date && item.date[0] && item.date[0].value) || 'Unknown Year',
                }
                return next
              })
              setTextures((prev) => {
                const next = [...prev]
                if (next[idx]) next[idx].dispose()
                next[idx] = tex
                return next
              })
            }
          }
        } catch {}
        if (swapCancelled.current) return
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_IMAGES))
      }
    }

    swapLoop()
    return () => { swapCancelled.current = true }
  }, [textures.length])

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

  if (textures.length < COUNT) return null

  return (
    <div className="cooper-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="collections" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
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
              <img src={proxyImg(imageUrls[expandedIndex])} alt="" />
            </div>
            <div className="expanded-back">
              <span className="rect-back-title">{artworkMetas[expandedIndex]?.title || 'Untitled'}</span>
              <span className="rect-back-artist">{artworkMetas[expandedIndex]?.artist || 'Unknown Designer'}</span>
              <span className="rect-back-year">{artworkMetas[expandedIndex]?.year || 'Unknown Year'}</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Cooper
