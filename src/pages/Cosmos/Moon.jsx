import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import MoonScene from '../../composants/cosmos/MoonScene'

function Moon() {
  return (
    <div className="w-screen h-screen bg-black">
      <BackArrow />
      <Informations />
      <CategoryMenu category="cosmos" />
      <Canvas camera={{ position: [6, 4, 8], fov: 45 }} dpr={[1, 2]} style={{ background: '#000' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <MoonScene />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Moon
