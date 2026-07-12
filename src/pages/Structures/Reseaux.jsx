import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import StructuresScene from '../../composants/structures/StructuresScene'

function Reseaux() {
  return (
    <div className="w-full h-screen">
      <BackArrow />
      <CategoryMenu category="structure" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <StructuresScene />
      </Canvas>
    </div>
  )
}

export default Reseaux
