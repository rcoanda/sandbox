import { Canvas } from '@react-three/fiber'
import K4DScene from '../../composants/abstrait/K4DScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import '../../styles/abstrait/K4D.css'

function K4D() {
  return (
    <div className="k4d-layout">
      <BackArrow />
      <Informations />
      <CategoryMenu category="abstrait" />
      <Canvas camera={{ position: [0, 0, 45], fov: 60 }} dpr={[1, 2]}>
        <K4DScene />
      </Canvas>
    </div>
  )
}

export default K4D
