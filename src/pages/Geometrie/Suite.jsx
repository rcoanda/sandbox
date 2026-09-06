import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import SuiteScene from '../../composants/geometrie/SuiteScene'
import Informations from '../../composants/globals/Informations'

function Suite() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="geometrie" />
      <SuiteScene />
    </div>
  )
}

export default Suite
