import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function F2() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="geometrie" />
      <iframe
        src="/F2.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="F2"
      />
    </div>
  )
}

export default F2
