import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function F1() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <CategoryMenu category="geometrie" />
      <iframe
        src="/F1.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="F1"
      />
    </div>
  )
}

export default F1
