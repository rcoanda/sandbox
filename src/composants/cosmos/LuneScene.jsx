import { useGLTF, useAnimations } from '@react-three/drei'
import moonGltf from '/assets/cosmos/moon.gltf?url'

function LuneScene() {
  const { scene, animations } = useGLTF(moonGltf)
  const { ref } = useAnimations(animations)

  return <primitive ref={ref} object={scene} />
}

export default LuneScene
