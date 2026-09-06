import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import EllipseScene, { setPaused } from '../../composants/trajectoires/EllipseScene'
import Overlay from '../../composants/globals/Overlay'
import '../../styles/trajectoires/Ellipse.css'
import Informations from '../../composants/globals/Informations'
import useTextureCosmiqueData from '../../composants/data/local/TextureCosmiqueData'

function Ellipse() {
  const { ready, textures, getImageUrl, getMeta } = useTextureCosmiqueData()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) return <div className="ellipse-page"><BackArrow /><CategoryMenu category="trajectoires" /></div>

  const meta = expandedIndex !== null ? getMeta(expandedIndex) : null

  return (
    <div className="ellipse-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="trajectoires" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <EllipseScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {meta && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={getImageUrl(expandedIndex)} onClose={handleClose} title={meta.title} author={meta.artist} />
        </div>
      )}
    </div>
  )
}

export default Ellipse
