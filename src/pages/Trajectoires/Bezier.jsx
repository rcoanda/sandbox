import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/trajectoires/Bezier.css'
import Informations from '../../composants/Informations'
import BezierScene, { CAM_POS } from '../../composants/trajectoires/BezierScene'

function Bezier() {
  return (
    <div className="bezier-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: CAM_POS, fov: 50 }} dpr={[1, 2]}>
        <BezierScene />
      </Canvas>
    </div>
  )
}

export default Bezier
