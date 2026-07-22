import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import AstronauteScene from '../../composants/cosmos/AstronauteScene'
import { useDragPan, DragHandle } from '../../composants/cosmos/DragHandle'

function Astronaute() {
  const { sceneOffset, dragging, pos, handleMouseDown } = useDragPan()

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      <BackArrow />
      <Informations />
      <CategoryMenu category="cosmos" />
      <div className="w-full h-full pointer-events-none">
        <Canvas camera={{ position: [6, 4, 8], fov: 45 }} dpr={[1, 2]} style={{ background: '#000' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 7]} intensity={1} />
          <group position={[sceneOffset.x, sceneOffset.y, 0]}>
            <AstronauteScene />
          </group>
          <OrbitControls />
        </Canvas>
      </div>
      <DragHandle dragging={dragging} pos={pos} onMouseDown={handleMouseDown} />
    </div>
  )
}

export default Astronaute
