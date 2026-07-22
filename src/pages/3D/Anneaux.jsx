import { Canvas } from '@react-three/fiber'
import { AnneauxScene } from '../../composants/3d/AnneauxScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function Anneaux() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0f0f0f', display: 'flex' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <AnneauxScene />
      </Canvas>
    </div>
  )
}

export default Anneaux
