import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
import ParfumWebMScene from '../../composants/design/ParfumWebMScene'

function ParfumWebM() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000000' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="design" />
      <ParfumWebMScene />
    </div>
  )
}

export default ParfumWebM