import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function M1() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <CategoryMenu category="trajectoires" />
      <iframe
        src="/M1.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="M1"
      />
    </div>
  )
}

export default M1
