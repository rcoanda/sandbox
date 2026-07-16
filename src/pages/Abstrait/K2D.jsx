import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import K2Scene from '../../composants/abstrait/K2Scene'
import Informations from '../../composants/Informations'

function K2D() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="abstrait" />
      <K2Scene />
    </div>
  )
}

export default K2D
