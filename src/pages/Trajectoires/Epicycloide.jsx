import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import '../../styles/trajectoires/Epicycloide.css'
import Informations from '../../composants/globals/Informations'
import EpicycloideScene from '../../composants/trajectoires/EpicycloideScene'

function Epicycloide() {
  return (
    <div className="epicycloide-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <EpicycloideScene />
      </Canvas>
    </div>
  )
}

export default Epicycloide
