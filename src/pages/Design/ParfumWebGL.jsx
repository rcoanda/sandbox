import { Canvas } from '@react-three/fiber'
import ParfumWebGLScene from '../../composants/design/ParfumWebGLScene'
import usePageDico from '../../composants/globals/Dico'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'

function ParfumWebGL() {
  const dico = usePageDico('parfumwebgl')

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000000', display: 'flex' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="design" />
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]}>
        <ParfumWebGLScene
          brand={dico?.marque}
          kind={dico?.type}
          details={dico?.details}
        />
      </Canvas>
    </div>
  )
}

export default ParfumWebGL