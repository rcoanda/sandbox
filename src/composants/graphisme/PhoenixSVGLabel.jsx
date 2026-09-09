import PhoenixSVGRectoLabel from './PhoenixSVGRectoLabel'
import PhoenixSVGVersoLabel from './PhoenixSVGVersoLabel'

function PhoenixSVGLabel({ transparent }) {
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
        <PhoenixSVGRectoLabel />
      </div>
      <div style={{ transform: 'scale(0.75)', transformOrigin: 'left' }}>
        <PhoenixSVGVersoLabel />
      </div>
    </div>
  )
}

export default PhoenixSVGLabel