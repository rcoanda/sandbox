import GeometrieScene from '../../composants/GeometrieScene'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

function F0() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <CategoryMenu category="geometrie" />
      <GeometrieScene />
    </div>
  )
}

export default F0
