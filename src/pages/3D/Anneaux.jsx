import { Canvas } from '@react-three/fiber'
import { AnneauxScene } from '../../composants/cosmos/AnneauxScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function Anneaux() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f0f0f' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
        <AnneauxScene />
      </Canvas>
    </div>
  )
}

export default Anneaux
