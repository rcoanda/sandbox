import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import F2Layout from '../../composants/geometrie/F2Layout'
import Informations from '../../composants/Informations'

function F2() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000000' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="geometrie" />
      <F2Layout />
    </div>
  )
}

export default F2
