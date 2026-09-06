import { Canvas } from '@react-three/fiber'
import Abstrait3DScene from '../../composants/abstrait/Abstrait3DScene'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
import '../../styles/abstrait/Abstrait3D.css'

function Abstrait3D() {
  return (
    <div className="abstrait3D-layout">
      <BackArrow />
      <Informations />
      <CategoryMenu category="abstrait" />
      <Canvas camera={{ position: [0, 0, 45], fov: 60 }} dpr={[1, 2]}>
        <Abstrait3DScene />
      </Canvas>
    </div>
  )
}

export default Abstrait3D
