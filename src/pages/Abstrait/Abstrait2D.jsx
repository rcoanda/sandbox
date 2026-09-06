import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Abstrait2DScene from '../../composants/abstrait/Abstrait2DScene'
import Informations from '../../composants/globals/Informations'

function Abstrait2D() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="abstrait" />
      <Abstrait2DScene />
    </div>
  )
}

export default Abstrait2D
