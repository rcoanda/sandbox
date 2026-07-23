import { useNavigate } from 'react-router-dom'
import '../styles/BackArrow.css'

function BackArrow() {
  const navigate = useNavigate()

  return (
    <button className="back-arrow" onClick={() => navigate('/')}>
      <svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-2.62268e-07 6L5.53846 -2.42094e-07L5.53846 12L-2.62268e-07 6Z" />
        <path d="M6 6H32" strokeWidth="2" />
      </svg>
    </button>
  )
}

export default BackArrow
