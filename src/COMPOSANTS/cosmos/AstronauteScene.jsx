import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function AstronauteScene() {
  const { scene, animations } = useGLTF('/moon_walk.gltf')
  const { ref, mixer } = useAnimations(animations)
  const cosmoRef = useRef()

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: child.name === 'Moon' ? 0x888888 : 0xffffff,
          metalness: 0.1,
          roughness: 0.6,
        })
      }
      if (child.name === 'Cosmonaut') {
        child.position.y = -0.35
        cosmoRef.current = child
      }
    })
  }, [scene])

  useFrame(({ clock }) => {
    if (!cosmoRef.current) return
    const t = clock.getElapsedTime()
    const radius = 3.5
    cosmoRef.current.position.x = Math.cos(t * 0.8) * radius
    cosmoRef.current.position.z = Math.sin(t * 0.8) * radius
  })

  return <primitive ref={ref} object={scene} />
}

export default AstronauteScene
