import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import RandomScene from '../../composants/trajectoires/RandomScene'

function M1() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0b1522' }}>
      <BackArrow />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <RandomScene />
      </Canvas>
    </div>
  )
}

export default M1
