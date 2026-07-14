import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import ClevelandScene, { setPaused } from '../../composants/galeriesApi/ClevelandScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Cleveland.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useClevelandData from '../../composants/data/ClevelandData'

function Cleveland() {
  const { ready, textures, getImageUrl, getMeta } = useClevelandData()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) return <div className="cleveland-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading /></div>

  const meta = expandedIndex !== null ? getMeta(expandedIndex) : null

  return (
    <div className="cleveland-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <ClevelandScene textures={textures} onImageClick={handleImageClick} />
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

export default Cleveland
