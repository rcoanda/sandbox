import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import TerreLuneScene from '../../composants/cosmos/TerreLuneScene'
import { useDragPan, DragHandle } from '../../composants/DragHandle'
import '../../styles/cosmos/TerreLune.css'

function TerreLune() {
  const { sceneOffset, dragging, pos, handleMouseDown } = useDragPan()

  return (
    <div className="sphere-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="cosmos" />
      <div className="sphere-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <color attach="background" args={['#050510']} />
          <fog attach="fog" args={['#050510', 30, 100]} />
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            minDistance={3}
            maxDistance={20}
          />
          <group position={[sceneOffset.x, sceneOffset.y, 0]}>
            <TerreLuneScene />
          </group>
        </Canvas>
      </div>
      <DragHandle dragging={dragging} pos={pos} onMouseDown={handleMouseDown} />
    </div>
  )
}

export default TerreLune
