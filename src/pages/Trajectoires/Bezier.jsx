import { Canvas } from '@react-three/fiber'
import SceneBezier from '../../composants/SceneBezier'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/trajectoires/Bezier.css'

function Bezier() {
  return (
    <div className="bezier-page">
      <BackArrow />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 5, 14], fov: 50 }} dpr={[1, 2]}>
        <SceneBezier />
      </Canvas>
    </div>
  )
}

export default Bezier
