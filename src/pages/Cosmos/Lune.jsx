import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import LuneScene from '../../composants/cosmos/LuneScene'
import { useDragPan, DragHandle } from '../../composants/DragHandle'
import '../../styles/cosmos/Lune.css'

function Lune() {
  const { sceneOffset, dragging, pos, handleMouseDown } = useDragPan()

  return (
    <div className="sphere-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="cosmos" />
      <div className="sphere-canvas-wrap">
        <Canvas camera={{ position: [6, 4, 8], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 7]} intensity={1} />
          <group position={[sceneOffset.x, sceneOffset.y, 0]}>
            <LuneScene />
          </group>
          <OrbitControls enableDamping dampingFactor={0.08} minDistance={3} maxDistance={20} />
        </Canvas>
      </div>
      <DragHandle dragging={dragging} pos={pos} onMouseDown={handleMouseDown} />
    </div>
  )
}

export default Lune
