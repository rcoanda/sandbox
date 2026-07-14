import { useGLTF, useAnimations } from '@react-three/drei'

function LuneScene() {
  const { scene, animations } = useGLTF('/moon.gltf')
  const { ref, mixer } = useAnimations(animations)

  return <primitive ref={ref} object={scene} />
}

export default LuneScene
