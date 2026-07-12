import Sphere from '../../composants/3d/Sphere'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function Satelite() {
  return (
    <>
      <BackArrow />
      <Informations />
      <CategoryMenu category="3d" />
      <Sphere />
    </>
  )
}

export default Satelite
