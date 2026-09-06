import { useLocation } from 'react-router-dom'
import usePageDico from './Dico'
import '../../styles/globals/Informations.css'

function Informations() {
  const location = useLocation()
  const pageKey = location.pathname.replace(/^\//, '')
  const dico = usePageDico(pageKey)

  return (
    <aside className="informations">
      <div>
        <h1>{dico?.title}</h1>
        <p>{dico?.description}</p>
      </div>
    </aside>
  )
}

export default Informations
