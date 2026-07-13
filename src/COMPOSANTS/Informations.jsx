import { useLocation } from 'react-router-dom'
import { categoryLinks } from './CategoryMenu'
import '../styles/Informations.css'

const pageLabels = Object.values(categoryLinks)
  .flat()
  .reduce((acc, { label, path }) => {
    acc[path] = label
    return acc
  }, {})

const pageDescriptions = Object.values(categoryLinks)
  .flat()
  .reduce((acc, { label, path }) => {
    acc[path] = `Le lorem ipsum est un faux texte standard utilisé en typographie et web design pour calibrer une mise en page. Il permet d'évaluer le rendu visuel (polices, espacements) sans que l'attention ne soit détournée par le sens du contenu.`
    return acc
  }, {})

function Informations() {
  const location = useLocation()
  const label = pageLabels[location.pathname] || ''
  const description = pageDescriptions[location.pathname] || ''

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
