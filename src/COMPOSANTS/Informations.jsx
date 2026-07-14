import { useLocation } from 'react-router-dom'
import { useDico } from './Dico'
import '../styles/Informations.css'

function Informations() {
  const { t } = useDico()
  const location = useLocation()
  const label = t('menu.' + location.pathname)
  const description = t('desc.' + location.pathname)

  return (
    <aside className="informations">
      <div>
        <h1>{label}</h1>
        <p>{description}</p>
      </div>
    </aside>
  )
}

export default Informations
