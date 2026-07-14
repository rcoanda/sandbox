import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import MetropolitanLayout from '../../composants/galeriesApi/MetropolitanLayout'
import '../../styles/galeriesApi/Metropolitan.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useMetropolitanData from '../../composants/data/MetropolitanData'

function Metropolitan() {
  const { ready, artworks } = useMetropolitanData()

  return (
    <div className="metropolitan-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      {ready ? <MetropolitanLayout artworks={artworks} ready={ready} /> : <Loading />}
    </div>
  )
}

export default Metropolitan
