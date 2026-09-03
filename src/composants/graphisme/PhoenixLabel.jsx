import PhoenixRectoLabel from './PhoenixRectoLabel'
import PhoenixVersoLabel from './PhoenixVersoLabel'

function PhoenixLabel({ transparent }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flexWrap: 'wrap',
        background: transparent ? 'transparent' : '#17140f',
      }}
    >
      <div style={{ transform: 'scale(0.75)', transformOrigin: 'right' }}>
        <PhoenixRectoLabel />
      </div>
      <div style={{ transform: 'scale(0.75)', transformOrigin: 'left' }}>
        <PhoenixVersoLabel />
      </div>
    </div>
  )
}

export default PhoenixLabel
