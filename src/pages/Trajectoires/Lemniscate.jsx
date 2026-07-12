import { Canvas } from '@react-three/fiber'
import SceneLemniscate from '../../composants/trajectoires/SceneLemniscate'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/trajectoires/Lemniscate.css'
import Informations from '../../composants/Informations'

function Lemniscate() {
  return (
    <div className="lemniscate-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <SceneLemniscate />
      </Canvas>
    </div>
  )
}

export default Lemniscate
