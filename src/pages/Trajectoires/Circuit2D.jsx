import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
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
