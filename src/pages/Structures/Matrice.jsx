import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import MatriceLayout from '../../composants/structures/MatriceLayout'
import Informations from '../../composants/globals/Informations'

function Matrice() {
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'auto',
      position: 'relative', background: '#0b1522',
    }}>
      <BackArrow />
      <Informations />
      <CategoryMenu category="structures" />
      <MatriceLayout />
    </div>
  )
}

export default Matrice
