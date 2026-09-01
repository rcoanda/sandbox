import { Canvas } from '@react-three/fiber'
import ParfumScene from '../../composants/design/ParfumScene'
import usePageDico from '../../composants/Dico'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function Parfum() {
  const dico = usePageDico('parfum')

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000000', display: 'flex' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="design" />
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]}>
        <ParfumScene
          brand={dico?.marque}
          kind={dico?.type}
          details={dico?.details}
        />
      </Canvas>
    </div>
  )
}

export default Parfum