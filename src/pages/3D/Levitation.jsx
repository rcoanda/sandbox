import { Canvas } from '@react-three/fiber'
import ThreeDScene from '../../composants/ThreeDScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/3d/Levitation.css'

function Levitation() {
  return (
    <div className="levitation-page">
      <BackArrow />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <ThreeDScene />
      </Canvas>
    </div>
  )
}

export default Levitation
