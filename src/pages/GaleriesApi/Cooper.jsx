import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import CooperScene, { setPaused } from '../../composants/galeriesApi/CooperScene'
import Overlay from '../../composants/globals/Overlay'
import '../../styles/galeriesApi/Cooper.css'
import Informations from '../../composants/globals/Informations'
import Loading from '../../composants/globals/Loading'
import useCooperData from '../../composants/data/api/CooperData'

function Cooper() {
  const { ready, textures, getImageUrl, getMeta, loadingError } = useCooperData()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) {
    return <div className="cooper-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading error={!!loadingError} /></div>
  }

  const meta = expandedIndex !== null ? getMeta(expandedIndex) : null

  return (
    <div className="cooper-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <CooperScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {meta && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={getImageUrl(expandedIndex)} onClose={handleClose} title={meta.title} author={meta.artist} date={meta.year} />
        </div>
      )}
    </div>
  )
}

export default Cooper
