import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
import CapsuleScene from '../../composants/design/CapsuleScene'

function Capsule() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000000' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="design" />
      <CapsuleScene />
    </div>
  )
}

export default Capsule
