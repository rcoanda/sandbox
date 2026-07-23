import { useGLTF, useAnimations } from '@react-three/drei'

function LuneScene() {
  const { scene, animations } = useGLTF('src/assets/cosmos/moon.gltf')
  const { ref } = useAnimations(animations)

  return <primitive ref={ref} object={scene} />
}

export default LuneScene
