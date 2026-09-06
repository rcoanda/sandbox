import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import HuitScene from '../../composants/trajectoires/HuitScene'
import { Canvas } from '@react-three/fiber'
import Informations from '../../composants/globals/Informations'

function Huit() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000000' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <HuitScene />
      </Canvas>
    </div>
  )
}

export default Huit
