import { useLocation, useNavigate } from 'react-router-dom'

export const categoryLinks = {
  geometrie: [
    { label: 'F0', path: '/f0' },
    { label: 'F2', path: '/f2' },
    { label: 'F3', path: '/f3' },
  ],
  '3d': [
    { label: 'Levitation', path: '/levitation' },
    { label: 'Satelite', path: '/satelite' },
    { label: 'Oscillation', path: '/oscillation' },
    { label: 'Anneaux', path: '/anneaux' },
  ],
  trajectoires: [
    { label: 'Huit', path: '/huit' },
    { label: 'Ellipse', path: '/ellipse' },
    { label: 'Lemniscate', path: '/lemniscate' },
    { label: 'Lissajous', path: '/lissajous' },
    { label: 'Spirale', path: '/spirale' },
    { label: 'Hypocycloide', path: '/hypocycloide' },
    { label: 'Epicycloide', path: '/epicycloide' },
    { label: 'Sinusoide', path: '/sinusoide' },
    { label: 'Bezier', path: '/bezier' },
    { label: 'Random', path: '/random' },
    { label: 'Ruban', path: '/ruban' },
  ],

  cosmos: [
    { label: 'TerreLune', path: '/terrelune' },
    { label: 'Moon', path: '/moon' },
    { label: 'Astronaute', path: '/astronaute' },
  ],
  abstrait: [
    { label: 'K2D', path: '/k2d' },
    { label: 'K3D', path: '/k3d' },
  ],
  structure: [
    { label: 'Réseaux', path: '/reseaux' },
    { label: 'Grid2D', path: '/grid2d' },
    { label: 'Grid3D', path: '/grid3d' },
    { label: 'Matrice', path: '/matrice' },
    { label: 'Cube', path: '/cube' },
    { label: 'Sfere', path: '/sfere' },
  ],
  galeriesApi: [
    { label: 'Terre', path: '/terre' },
    { label: 'Metropolitan', path: '/metropolitan' },
    { label: 'Europe', path: '/europe' },
    { label: 'Cleveland', path: '/cleveland' },
    { label: 'Chicago', path: '/chicago' },
    { label: 'Cooper', path: '/cooper' },
    { label: 'Aquatique', path: '/aquatique' },
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
