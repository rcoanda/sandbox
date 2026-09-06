import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
import PortfoliosScene from '../../composants/portfolios/PortfoliosScene'
import '../../styles/portfolios/Portfolios.css'

function Portfolios() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'radial-gradient(1200px 640px at 50% -10%, #2a1416 0%, #141013 42%, #08080a 100%)',
        color: '#eee',
        padding: '90px 24px 78px',
      }}
    >
      <BackArrow />
      <Informations />
      <CategoryMenu category="portfolios" />
      <PortfoliosScene />
    </div>
  )
}

export default Portfolios