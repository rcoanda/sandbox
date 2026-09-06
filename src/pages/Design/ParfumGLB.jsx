import { Canvas } from '@react-three/fiber'
import ParfumGLBScene from '../../composants/design/ParfumGLBScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function ParfumGLB() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000000', display: 'flex' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="design" />
      <Canvas camera={{ position: [0, 0, 4.6], fov: 45 }} dpr={[1, 2]}>
        <ParfumGLBScene />
      </Canvas>
    </div>
  )
}

export default ParfumGLB