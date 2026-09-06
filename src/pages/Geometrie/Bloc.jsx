import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import BlocScene from '../../composants/geometrie/BlocScene'
import Informations from '../../composants/globals/Informations'

function Bloc() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000000' }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="geometrie" />
      <BlocScene />
    </div>
  )
}

export default Bloc
