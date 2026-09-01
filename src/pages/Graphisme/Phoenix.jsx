import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import PhoenixLabel from '../../composants/graphisme/PhoenixLabel'

function Phoenix() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#17140f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BackArrow />
      <Informations />
      <CategoryMenu category="graphisme" />
      <PhoenixLabel />
    </div>
  )
}

export default Phoenix