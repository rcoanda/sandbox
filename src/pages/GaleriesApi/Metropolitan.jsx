import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import MetropolitanLayout from '../../composants/galeriesApi/MetropolitanLayout'
import '../../styles/galeriesApi/Metropolitan.css'
import Informations from '../../composants/Informations'

function Metropolitan() {
  return (
    <div className="metropolitan-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <MetropolitanLayout />
    </div>
  )
}

export default Metropolitan
