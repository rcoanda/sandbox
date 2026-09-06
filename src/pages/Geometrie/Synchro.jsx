import SynchroScene from '../../composants/geometrie/SynchroScene'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'

function Synchro() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#0b1522' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="geometrie" />
      <SynchroScene />
    </div>
  )
}

export default Synchro
