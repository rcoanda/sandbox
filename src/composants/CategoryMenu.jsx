import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDico } from './Dico'
import { pageToPath } from './keys'
import { categoryLinks } from './keys'

function CategoryMenu({ category }) {
  const { lang } = useDico()
  const [labels, setLabels] = useState({})
  const location = useLocation()
  const navigate = useNavigate()
  const paths = categoryLinks[category] || []

  useEffect(() => {
    const routeToFile = (route) => {
      const key = route.replace(/^\//, '')
      return pageToPath[key] || key
    }
    Promise.all(
      paths.map((route) =>
        fetch(`${import.meta.env.BASE_URL}lang/${lang}/pages/${routeToFile(route)}.json`)
          .then((r) => r.json())
          .then((data) => ({ route, title: data.title }))
          .catch(() => ({ route, title: null }))
      )
    ).then((results) => {
      const map = {}
      results.forEach(({ route, title }) => { map[route] = title })
      setLabels(map)
    })
  }, [lang, paths])

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
      {paths.map((path) => {
        const isActive = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
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
            {labels[path] || path.slice(1)}
          </button>
        )
      })}
    </nav>
  )
}

export default CategoryMenu
