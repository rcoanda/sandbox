import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import RubanScene from '../../composants/trajectoires/RubanScene'

function Ruban() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0b1522' }}>
      <BackArrow />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 5, 7], fov: 50, up: [0, 1, 0] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <RubanScene />
      </Canvas>
    </div>
  )
}

export default Ruban
