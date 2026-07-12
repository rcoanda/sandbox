import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import CubeScene from '../../composants/structures/CubeScene'
import '../../styles/structures/Cube.css'
import Informations from '../../composants/Informations'

function Cube() {
  return (
    <div className="cube-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="structure" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <CubeScene />
      </Canvas>
    </div>
  )
}

export default Cube
