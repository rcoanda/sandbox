import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'

function K3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="abstrait" />
      <iframe
        src="/K3D.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="K3D"
      />
    </div>
  )
}

export default K3D
