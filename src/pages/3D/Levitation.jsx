import { Canvas } from '@react-three/fiber'
import LevitationScene from '../../composants/3d/LevitationScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/3d/Levitation.css'
import Informations from '../../composants/Informations'

function Levitation() {
  return (
    <div className="levitation-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <LevitationScene />
      </Canvas>
    </div>
  )
}

export default Levitation
