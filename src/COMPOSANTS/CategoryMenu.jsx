import { useLocation, useNavigate } from 'react-router-dom'

const categoryLinks = {
  structure: [
    { label: 'Grid', path: '/grid' },
  ],
  '3d': [
    { label: 'Satelite', path: '/satelite' },
  ],
  motion: [
    { label: 'Infini', path: '/infini' },
    { label: 'Random', path: '/random' },
  ],
  geometrie: [
    { label: 'F1', path: '/f1' },
    { label: 'F2', path: '/f2' },
    { label: 'F3', path: '/f3' },
  ],
  cosmos: [
    { label: 'Cosmos', path: '/cosmos' },
    { label: 'Moon', path: '/moon' },
    { label: 'Astronaute', path: '/astronaute' },
  ],
  abstrait: [
    { label: 'K2D', path: '/k2d' },
    { label: 'K3D', path: '/k3d' },
  ],
  collections: [
    { label: 'Animation', path: '/animation' },
    { label: 'Metropolitan', path: '/metropolitan' },
    { label: 'Chicago', path: '/chicago' },
    { label: 'Europe', path: '/europe' },
  ],
}

function CategoryMenu({ category }) {
  const location = useLocation()
  const navigate = useNavigate()
  const links = categoryLinks[category] || []

  return (
    <nav
      style={{
        position: 'fixed',
        top: '50%',
        right: 45,
        transform: 'translateY(-50%)',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {links.map((link) => {
        const isActive = location.pathname === link.path
        return (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 0',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: isActive ? 400 : 300,
              color: isActive ? '#000' : '#999',
              letterSpacing: '0.02em',
              transition: 'color 0.2s',
              textAlign: 'right',
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = '#555'
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = '#999'
            }}
          >
            {link.label}
          </button>
        )
      })}
    </nav>
  )
}

export default CategoryMenu
