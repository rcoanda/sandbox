import rectoJpg from '/assets/graphisme/phoenix-recto.jpg'
import versojpg from '/assets/graphisme/phoenix-verso.jpg'

function PhoenixJPGLabel({ transparent }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        flexWrap: 'wrap',
        background: transparent ? 'transparent' : '#17140f',
      }}
    >
      <img src={rectoJpg} alt="Étiquette Phoenix recto" style={{ width: 320, height: 'auto' }} />
      <img src={versojpg} alt="Étiquette Phoenix verso" style={{ width: 320, height: 'auto' }} />
    </div>
  )
}

export default PhoenixJPGLabel