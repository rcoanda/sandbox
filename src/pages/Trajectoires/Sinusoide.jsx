import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import '../../styles/trajectoires/Sinusoide.css'
import Informations from '../../composants/globals/Informations'
import SinusoideScene from '../../composants/trajectoires/SinusoideScene'

function Sinusoide() {
  return (
    <div className="sinusoide-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <SinusoideScene />
      </Canvas>
    </div>
  )
}

export default Sinusoide
