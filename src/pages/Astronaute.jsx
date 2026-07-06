import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Model() {
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
        child.position.y = 2.1
        cosmoRef.current = child
      }
    })
  }, [scene])

  useFrame(({ clock }) => {
    if (!cosmoRef.current) return
    const t = clock.getElapsedTime() * 0.3
    cosmoRef.current.position.x = Math.cos(t) * 1.5
    cosmoRef.current.position.z = Math.sin(t) * 1.5
  })

  return <primitive ref={ref} object={scene} />
}

function Astronaute() {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas camera={{ position: [6, 4, 8], fov: 45 }} dpr={[1, 2]} style={{ background: '#000' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Astronaute
