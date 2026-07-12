import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RADIUS = 2
const SIZE = 0.25

let paused = false

export function setPaused(v) {
  paused = v
}

const sphereElements = Array.from({ length: 120 }, (_, i) => {
  const phi = Math.acos(1 - 2 * (i + 0.5) / 120)
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

function CooperScene({ textures, onImageClick }) {
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

export default CooperScene
