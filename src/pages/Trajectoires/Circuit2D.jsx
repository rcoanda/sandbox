import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import Circuit2DScene from '../../composants/trajectoires/Circuit2DScene'
import '../../styles/trajectoires/Circuit2D.css'

function Circuit2D() {
  return (
    <div className="circuit-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <div className="circuit-stage">
        <Circuit2DScene />
      </div>
    </div>
  )
}

export default Circuit2D
