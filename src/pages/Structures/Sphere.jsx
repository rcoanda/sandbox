import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import SphereScene from '../../composants/structures/SphereScene'
import '../../styles/structures/Sphere.css'
import Informations from '../../composants/globals/Informations'

function Sphere() {
  return (
    <div className="sfere-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="structures" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <SphereScene />
      </Canvas>
    </div>
  )
}

export default Sphere
