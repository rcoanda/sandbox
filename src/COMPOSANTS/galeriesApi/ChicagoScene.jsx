import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const N = 3
const SIZE = 0.6
const SPACING = 2 / N
const OFFSET = (N - 1) * SPACING / 2

let paused = false

export function setPaused(v) {
  paused = v
}

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

function ChicagoScene({ textures, onImageClick }) {
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

export default ChicagoScene
