import { useNavigate } from 'react-router-dom'
import { useDico } from './Dico'
import { navigation } from './keys'

function Navigation() {
  const navigate = useNavigate()
  const { t, lang, toggleLang } = useDico()

  return (
    <nav className="home-nav">
      {navigation.map((page) => (
        <button key={page.id} onClick={() => navigate(page.route)} className="home-nav-link">
          {t(`nav.${page.id}`)}
        </button>
      ))}
      <button onClick={toggleLang} className="home-nav-link">{lang === 'fr' ? 'EN' : 'FR'}</button>
    </nav>
  )
}

export default Navigation
