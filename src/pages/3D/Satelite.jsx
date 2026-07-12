import SateliteScene from '../../composants/3d/SateliteScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function Satelite() {
  return (
    <>
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <SateliteScene />
    </>
  )
}

export default Satelite
