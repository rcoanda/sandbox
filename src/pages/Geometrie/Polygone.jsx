import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import PolygoneScene from '../../composants/geometrie/PolygoneScene'
import Informations from '../../composants/globals/Informations'

function Polygone() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000000' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="geometrie" />
      <PolygoneScene />
    </div>
  )
}

export default Polygone