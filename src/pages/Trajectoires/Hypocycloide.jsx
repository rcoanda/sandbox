import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import '../../styles/trajectoires/Hypocycloide.css'
import Informations from '../../composants/globals/Informations'
import HypocycloideScene from '../../composants/trajectoires/HypocycloideScene'

function Hypocycloide() {
  return (
    <div className="hypocycloide-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <HypocycloideScene />
      </Canvas>
    </div>
  )
}

export default Hypocycloide
