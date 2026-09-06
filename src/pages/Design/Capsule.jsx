import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
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
