import { useNavigate } from 'react-router-dom'

function Navigation() {
  const navigate = useNavigate()

  return (
    <nav className="home-nav">
      <button onClick={() => navigate('/about')} className="home-nav-link">A propos</button>
      <button onClick={() => navigate('/contact')} className="home-nav-link">Contact</button>
      <button onClick={() => navigate('/archive')} className="home-nav-link">Archive</button>
    </nav>
  )
}

export default Navigation
