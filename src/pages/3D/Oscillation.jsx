import { Canvas } from '@react-three/fiber'
import OscillationScene from '../../composants/3d/OscillationScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function Oscillation() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0f0f0f', display: 'flex' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <OscillationScene />
      </Canvas>
    </div>
  )
}

export default Oscillation
