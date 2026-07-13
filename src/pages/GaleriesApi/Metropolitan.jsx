import { useState } from 'react'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import MetropolitanLayout from '../../composants/galeriesApi/MetropolitanLayout'
import '../../styles/galeriesApi/Metropolitan.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'

function Metropolitan() {
  const [ready, setReady] = useState(false)

  return (
    <div className="metropolitan-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      {ready ? <MetropolitanLayout onReady={setReady} /> : <Loading />}
    </div>
  )
}

export default Metropolitan
