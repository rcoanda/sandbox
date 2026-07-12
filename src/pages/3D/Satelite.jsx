import Sphere from '../../composants/3d/Sphere'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function Satelite() {
  return (
    <>
      <BackArrow />
      <CategoryMenu category="3d" />
      <Sphere />
    </>
  )
}

export default Satelite
