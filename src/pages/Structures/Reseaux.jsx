import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import ReseauxScene from '../../composants/structures/ReseauxScene'

import Informations from '../../composants/Informations'

function Reseaux() {
  return (
    <div className="w-full h-screen" style={{ background: '#0b1522' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="structures" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ReseauxScene />
      </Canvas>
    </div>
  )
}

export default Reseaux
