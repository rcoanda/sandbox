import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import F3Layout from '../../composants/geometrie/F3Layout'
import Informations from '../../composants/Informations'

function F3() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="geometrie" />
      <F3Layout />
    </div>
  )
}

export default F3
