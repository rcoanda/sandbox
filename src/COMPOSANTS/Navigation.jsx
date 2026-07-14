import { useNavigate } from 'react-router-dom'
import { useDico } from './Dico'

function Navigation() {
  const navigate = useNavigate()
  const { t, lang, toggleLang } = useDico()

  return (
    <nav className="home-nav">
      <button onClick={() => navigate('/about')} className="home-nav-link">{t('nav.about')}</button>
      <button onClick={() => navigate('/contact')} className="home-nav-link">{t('nav.contact')}</button>
      <button onClick={() => navigate('/archive')} className="home-nav-link">{t('nav.archive')}</button>
      <button onClick={toggleLang} className="home-nav-link">{lang === 'fr' ? 'EN' : 'FR'}</button>
    </nav>
  )
}

export default Navigation
