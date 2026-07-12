import CosmosSphere from '../../composants/cosmos/CosmosSphere'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function TerreLune() {
  return (
    <>
      <BackArrow />
      <Informations />
      <CategoryMenu category="cosmos" />
      <CosmosSphere />
    </>
  )
}

export default TerreLune
