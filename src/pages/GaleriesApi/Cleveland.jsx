import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import ClevelandScene, { setPaused } from '../../composants/galeriesApi/ClevelandScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Cleveland.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useClevelandData from '../../composants/data/api/ClevelandData'

function Cleveland() {
  const { ready, textures, getImageUrl, getMeta, loadingError } = useClevelandData()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) return <div className="cleveland-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading error={!!loadingError} /></div>

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
          <Overlay key={expandedIndex} imageSrc={getImageUrl(expandedIndex)} onClose={handleClose} title={meta.title} author={meta.artist} date={meta.year} />
        </div>
      )}
    </div>
  )
}

export default Cleveland
