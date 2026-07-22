import { Canvas } from '@react-three/fiber'
import LevitationScene from '../../composants/3d/LevitationScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function Levitation() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0f0f0f', display: 'flex' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]}>
        <LevitationScene />
      </Canvas>
    </div>
  )
}

export default Levitation
