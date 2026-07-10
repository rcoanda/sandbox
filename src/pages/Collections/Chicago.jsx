import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/Chicago.css'

const N = 3
const SIZE = 0.6
const SPACING = 2 / N
const OFFSET = (N - 1) * SPACING / 2
const RENEWAL_INTERVAL = 4000

function PetitCube({ pos, imageUrl }) {
  const texture = useTexture(imageUrl)

  return (
    <group position={pos}>
      <mesh>
        <boxGeometry args={[SIZE, SIZE, SIZE]} />
        <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(SIZE, SIZE, SIZE)]} />
        <lineBasicMaterial color="#000" />
      </lineSegments>
    </group>
  )
}

function Cube3D({ imageUrls }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = t * 0.4
    groupRef.current.rotation.y = t * 0.6
  })

  const cubes = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        const idx = i * N * N + j * N + k
        const url = imageUrls[idx] || ''
        cubes.push(
          <PetitCube
            key={idx}
            pos={[i * SPACING - OFFSET, j * SPACING - OFFSET, k * SPACING - OFFSET]}
            imageUrl={url}
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

function Scene({ imageUrls }) {
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
      {imageUrls.length === N * N * N && <Cube3D imageUrls={imageUrls} />}
    </group>
  )
}

function Chicago() {
  const [imageUrls, setImageUrls] = useState([])

  const fetchArtworks = (page) => {
    fetch(`https://api.artic.edu/api/v1/artworks?limit=27&page=${page}&fields=id,image_id`)
      .then(r => r.json())
      .then(d => {
        const urls = d.data
          .filter(item => item.image_id)
          .map(item => `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`)
        if (urls.length >= N * N * N) {
          setImageUrls(urls.slice(0, N * N * N))
        }
      })
  }

  useEffect(() => {
    const page = Math.floor(Math.random() * 1000) + 1
    fetchArtworks(page)
    const interval = setInterval(() => {
      const next = Math.floor(Math.random() * 1000) + 1
      fetchArtworks(next)
    }, RENEWAL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="chicago-page">
      <BackArrow />
      <CategoryMenu category="collections" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Scene imageUrls={imageUrls} />
      </Canvas>
    </div>
  )
}

export default Chicago
