import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import '../../styles/trajectoires/Lissajous.css'
import Informations from '../../composants/globals/Informations'
import LissajousScene from '../../composants/trajectoires/LissajousScene'

function Lissajous() {
  return (
    <div className="lissajous-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <LissajousScene />
      </Canvas>
    </div>
  )
}

export default Lissajous
