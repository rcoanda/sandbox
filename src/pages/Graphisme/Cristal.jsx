import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
import CristalLabel from '../../composants/graphisme/CristalLabel'

function Cristal() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'auto',
        background: '#17140f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
      }}
    >
      <BackArrow />
      <Informations />
      <CategoryMenu category="graphisme" />
      <CristalLabel />
    </div>
  )
}

export default Cristal
