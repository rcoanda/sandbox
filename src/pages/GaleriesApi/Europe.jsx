import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import EuropeScene, { setPaused } from '../../composants/galeriesApi/EuropeScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Europe.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useEuropeData from '../../composants/data/EuropeData'

function Europe() {
  const { ready, textures, getImageUrl, getMeta } = useEuropeData()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) return <div className="europe-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading /></div>

  const meta = expandedIndex !== null ? getMeta(expandedIndex) : null

  return (
    <div className="europe-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <EuropeScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {meta && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={getImageUrl(expandedIndex)} onClose={handleClose} title={meta.title} author={meta.artist} />
        </div>
      )}
    </div>
  )
}

export default Europe
