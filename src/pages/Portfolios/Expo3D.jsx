import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
import Expo3DScene from '../../composants/portfolios/Expo3DScene'

function Expo3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0b0b0f' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="portfolios" />
      <Canvas camera={{ position: [0, 0, 0.1], fov: 65 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <Expo3DScene />
      </Canvas>
    </div>
  )
}

export default Expo3D