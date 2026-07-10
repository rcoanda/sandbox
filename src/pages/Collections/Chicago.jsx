import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/Chicago.css'

const N = 3
const SIZE = 0.6
const SPACING = 2 / N
const OFFSET = (N - 1) * SPACING / 2

function PetitCube({ pos, texture }) {
  return (
    <group position={pos}>
      <mesh>
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

function Cube3D({ textures }) {
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
        cubes.push(
          <PetitCube
            key={idx}
            pos={[i * SPACING - OFFSET, j * SPACING - OFFSET, k * SPACING - OFFSET]}
            texture={textures[idx]}
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
      <Cube3D textures={textures} />
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

  useEffect(() => {
    const page = Math.floor(Math.random() * 1000) + 1
    fetch(`https://api.artic.edu/api/v1/artworks?limit=27&page=${page}&fields=id,image_id`)
      .then(r => r.json())
      .then(d => {
        const urls = d.data
          .filter(item => item.image_id)
          .map(item => `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`)
        if (urls.length >= N * N * N) {
          Promise.all(urls.slice(0, N * N * N).map(preloadTexture)).then(setTextures)
        }
      })
  }, [])

  if (textures.length < N * N * N) return null

  return (
    <div className="chicago-page">
      <BackArrow />
      <CategoryMenu category="collections" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Scene textures={textures} />
      </Canvas>
    </div>
  )
}

export default Chicago
