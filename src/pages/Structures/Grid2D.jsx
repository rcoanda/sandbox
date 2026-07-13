import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Grid2DLayout from '../../composants/structures/Grid2DLayout'
import '../../styles/structures/Grid.css'
import Informations from '../../composants/Informations'

function Grid2D() {
  return (
    <div className="grid-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="structure" />
      <Grid2DLayout />
    </div>
  )
}

export default Grid2D
