import { Canvas } from '@react-three/fiber'
import SceneTrajectoires from '../../composants/trajectoires/SceneTrajectoires'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function Oscillation() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f0f0f' }}>
      <BackArrow />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <SceneTrajectoires />
      </Canvas>
    </div>
  )
}

export default Oscillation
