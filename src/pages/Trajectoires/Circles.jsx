import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import '../../styles/trajectoires/Circles.css'
import Informations from '../../composants/globals/Informations'
import CirclesScene from '../../canvas/trajectoires/CirclesScene'

function Circles() {
  return (
    <div className="circles-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <CirclesScene />
      </Canvas>
    </div>
  )
}

export default Circles
