import { Canvas } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei'

function Model() {
  const { scene, animations } = useGLTF('/moon_walk.gltf')
  const { ref, mixer } = useAnimations(animations)

  return <primitive ref={ref} object={scene} />
}

function GLB() {
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

export default GLB
