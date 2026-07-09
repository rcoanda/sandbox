import CosmosSphere from '../../composants/CosmosSphere'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function Cosmos() {
  return (
    <>
      <BackArrow />
      <CategoryMenu category="cosmos" />
      <CosmosSphere />
    </>
  )
}

export default Cosmos
