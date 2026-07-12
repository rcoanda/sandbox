import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/galeriesApi/Chicago.css'
import Informations from '../../composants/Informations'

const N = 3
const SIZE = 0.6
const SPACING = 2 / N
const OFFSET = (N - 1) * SPACING / 2
const DELAY_BETWEEN_IMAGES = 1000
let paused = false

function PetitCube({ pos, texture, onClick }) {
  return (
    <group position={pos}>
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
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(SIZE, SIZE, SIZE)]} />
        <lineBasicMaterial color="#000" />
      </lineSegments>
    </group>
  )
}

function Cube3D({ textures, onImageClick }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (paused) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = t * 0.4
    groupRef.current.rotation.y = t * 0.6
  })

  const cubes = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        const idx = i * N * N + j * N + k
        cubes.push(
          <PetitCube
            key={idx}
            pos={[i * SPACING - OFFSET, j * SPACING - OFFSET, k * SPACING - OFFSET]}
            texture={textures[idx]}
            onClick={() => onImageClick(idx)}
          />
        )
      }
    }
  }

  return (
    <group ref={groupRef}>
      {cubes}
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
      <Cube3D textures={textures} onImageClick={onImageClick} />
    </group>
  )
}

function preloadTexture(url) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(url, (t) => resolve(t), undefined, () => resolve(null))
  })
}

function Chicago() {
  const [textures, setTextures] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [artworkMetas, setArtworkMetas] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)
  const swapCancelled = useRef(false)

  useEffect(() => {
    const page = Math.floor(Math.random() * 1000) + 1
    fetch(`https://api.artic.edu/api/v1/artworks?limit=27&page=${page}&fields=id,image_id,title,artist_display,date_display`)
      .then(r => r.json())
      .then(d => {
        const items = d.data.filter(item => item.image_id)
        if (items.length >= N * N * N) {
          const selected = items.slice(0, N * N * N)
          setImageUrls(selected.map(item => `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`))
          setArtworkMetas(selected.map(item => ({
            title: item.title || 'Untitled',
            artist: (item.artist_display || '').split('\n')[0].trim() || 'Unknown Artist',
            year: item.date_display || 'Unknown Year',
          })))
          Promise.all(selected.map(item => preloadTexture(`https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`))).then(setTextures)
        }
      })
  }, [])

  useEffect(() => {
    if (textures.length < N * N * N) return
    swapCancelled.current = false

    const swapLoop = async () => {
      while (!swapCancelled.current) {
        const idx = Math.floor(Math.random() * N * N * N)
        const page = Math.floor(Math.random() * 1000) + 1
        try {
          const res = await fetch(
            `https://api.artic.edu/api/v1/artworks?limit=1&page=${page}&fields=id,image_id,title,artist_display,date_display`
          )
          const d = await res.json()
          const item = d.data.find((i) => i.image_id)
          if (item && !swapCancelled.current) {
            const url = `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
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
                  title: item.title || 'Untitled',
                  artist: (item.artist_display || '').split('\n')[0].trim() || 'Unknown Artist',
                  year: item.date_display || 'Unknown Year',
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

  if (textures.length < N * N * N) return null

  return (
    <div className="chicago-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
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
              <img src={imageUrls[expandedIndex]} alt="" />
            </div>
            <div className="expanded-back">
              <span className="rect-back-title">{artworkMetas[expandedIndex]?.title || 'Untitled'}</span>
              <span className="rect-back-artist">{artworkMetas[expandedIndex]?.artist || 'Unknown Artist'}</span>
              <span className="rect-back-year">{artworkMetas[expandedIndex]?.year || 'Unknown Year'}</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Chicago
