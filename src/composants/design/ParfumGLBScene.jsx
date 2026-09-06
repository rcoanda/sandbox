import { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import parfumGltf from '/assets/design/parfum.glb?url'

function ParfumGLBScene() {
  const { scene, animations } = useGLTF(parfumGltf)
  const { ref, actions } = useAnimations(animations)

  useEffect(() => {
    const list = Object.values(actions)
    if (list.length) list[0].play()
  }, [actions])

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 6, 4]} intensity={1.5} />
      <directionalLight position={[-4, -3, -2]} intensity={0.4} color="#a5d6ff" />
      <primitive ref={ref} object={scene} />
    </>
  )
}

export default ParfumGLBScene