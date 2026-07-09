import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function F3() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <CategoryMenu category="geometrie" />
      <iframe
        src="/F3.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="F3"
      />
    </div>
  )
}

export default F3
