import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import ChicagoScene, { setPaused } from '../../composants/galeriesApi/ChicagoScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Chicago.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useChicagoData from '../../composants/data/ChicagoData'

const N = 3

function Chicago() {
  const { ready, textures, getImageUrl, getMeta } = useChicagoData()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) return <div className="chicago-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading /></div>

  const meta = expandedIndex !== null ? getMeta(expandedIndex) : null

  return (
    <div className="chicago-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <ChicagoScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {meta && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={getImageUrl(expandedIndex)} onClose={handleClose}>
            <span className="rect-back-title">{meta.title}</span>
            <span className="rect-back-artist">{meta.artist}</span>
            <span className="rect-back-year">{meta.year}</span>
          </Overlay>
        </div>
      )}
    </div>
  )
}

export default Chicago
