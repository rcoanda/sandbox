import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import SfereScene from '../../composants/structures/SfereScene'
import '../../styles/structures/Sfere.css'
import Informations from '../../composants/Informations'

function Sfere() {
  return (
    <div className="sfere-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="structure" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <SfereScene />
      </Canvas>
    </div>
  )
}

export default Sfere
