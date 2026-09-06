import { Canvas } from '@react-three/fiber'
import HamburgerScene from '../../composants/design/HamburgerScene'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'

function Hamburger() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000000', display: 'flex' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="design" />
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]}>
        <HamburgerScene />
      </Canvas>
    </div>
  )
}

export default Hamburger
