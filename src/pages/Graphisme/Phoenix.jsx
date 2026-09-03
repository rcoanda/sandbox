import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import PhoenixRectoLabel from '../../composants/graphisme/PhoenixRectoLabel'
import PhoenixVersoLabel from '../../composants/graphisme/PhoenixVersoLabel'

function Phoenix() {
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
      <div
        style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PhoenixRectoLabel />
        <PhoenixVersoLabel />
      </div>
    </div>
  )
}

export default Phoenix