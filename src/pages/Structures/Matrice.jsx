import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import MatriceLayout from '../../composants/structures/MatriceLayout'
import Informations from '../../composants/Informations'

function Matrice() {
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'auto',
      position: 'relative', background: '#0b1522',
    }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="structure" />
      <MatriceLayout />
    </div>
  )
}

export default Matrice
