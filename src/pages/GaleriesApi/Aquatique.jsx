import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import AquatiqueScene, { setPaused } from '../../composants/galeriesApi/AquatiqueScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Aquatique.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useAquatiqueData from '../../composants/data/dist/AquatiqueData'

function Aquatique() {
  const { ready, texturePool, getMeta } = useAquatiqueData()
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [expandedUrl, setExpandedUrl] = useState('')

  const handleImageClick = useCallback((index, url) => {
    setPaused(true)
    setExpandedIndex(index)
    setExpandedUrl(url)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  return (
    <div className="aquatique-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 5, 7], fov: 50, up: [0, 1, 0] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <AquatiqueScene texturePool={texturePool} onImageClick={handleImageClick} />
      </Canvas>
      {!ready && <Loading />}
      {expandedIndex !== null && expandedUrl && (() => {
        const meta = getMeta(expandedIndex)
        return (
          <div className="expanded-rect">
            <Overlay key={expandedIndex} imageSrc={expandedUrl} onClose={handleClose} title={meta?.title} author={meta?.artist} />
          </div>
        )
      })()}
    </div>
  )
}

export default Aquatique
