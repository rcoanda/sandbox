import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import Circuit3DScene from '../../composants/trajectoires/Circuit3DScene'
import '../../styles/trajectoires/Circuit3D.css'

function Circuit3D() {
  return (
    <div className="circuit-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <Circuit3DScene />
      </Canvas>
    </div>
  )
}

export default Circuit3D
