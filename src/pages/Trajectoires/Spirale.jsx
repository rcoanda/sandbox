import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/trajectoires/Spirale.css'
import Informations from '../../composants/Informations'
import SpiraleScene from '../../composants/trajectoires/SpiraleScene'

function Spirale() {
  return (
    <div className="spirale-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <SpiraleScene />
      </Canvas>
    </div>
  )
}

export default Spirale
