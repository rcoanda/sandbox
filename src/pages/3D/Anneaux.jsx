import { Canvas } from '@react-three/fiber'
import { CosmosScene } from '../../composants/cosmos/CosmosScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function Anneaux() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f0f0f' }}>
      <BackArrow />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
        <CosmosScene />
      </Canvas>
    </div>
  )
}

export default Anneaux
