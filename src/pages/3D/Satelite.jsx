import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SateliteScene from '../../composants/3d/SateliteScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import { useDragPan, DragHandle } from '../../composants/cosmos/DragHandle'
import '../../styles/cosmos/Satelite.css'

function Satelite() {
  const { sceneOffset, dragging, pos, handleMouseDown } = useDragPan()

  return (
    <div
      className={`sphere-page${dragging ? ' sphere-page--dragging' : ''}`}
      onMouseDown={handleMouseDown}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <div className="sphere-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />
          <group position={[sceneOffset.x, sceneOffset.y, 0]}>
            <SateliteScene />
          </group>
          <OrbitControls enableDamping dampingFactor={0.08} minDistance={3} maxDistance={20} />
        </Canvas>
      </div>
      <DragHandle dragging={dragging} pos={pos} />
    </div>
  )
}

export default Satelite
