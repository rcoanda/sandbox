import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import LabyrintheScene from '../../composants/trajectoires/LabyrintheScene'
import '../../styles/trajectoires/Labyrinthe.css'

function Labyrinthe() {
  return (
    <div className="labyrinthe-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <div className="labyrinthe-stage">
        <LabyrintheScene />
      </div>
    </div>
  )
}

export default Labyrinthe
