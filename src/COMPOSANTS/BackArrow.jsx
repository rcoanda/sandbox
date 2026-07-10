import { useNavigate } from 'react-router-dom'
import '../styles/BackArrow.css'

function BackArrow({ color }) {
  const navigate = useNavigate()
  const c = color || '#fff'

  return (
    <button className="back-arrow" onClick={() => navigate('/')}>
      <svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={color ? { mixBlendMode: 'unset' } : {}}>
        <path d="M-2.62268e-07 6L5.53846 -2.42094e-07L5.53846 12L-2.62268e-07 6Z" style={{ fill: c }} />
        <path d="M6 6H32" strokeWidth="2" style={{ stroke: c }} />
      </svg>
    </button>
  )
}

export default BackArrow
