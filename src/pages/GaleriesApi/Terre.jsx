import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import TerreScene, { setPaused } from '../../composants/galeriesApi/TerreScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Terre.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useTerreData from '../../composants/data/TerreData'
import useTextureCosmiqueData from '../../composants/data/TextureCosmiqueData'
import useEuropeData from '../../composants/data/EuropeData'
import useMetropolitanData from '../../composants/data/MetropolitanData'
import useAquatiqueData from '../../composants/data/AquatiqueData'
import useClevelandData from '../../composants/data/ClevelandData'
import useCooperData from '../../composants/data/CooperData'
import useChicagoData from '../../composants/data/ChicagoData'

function Terre() {
  const { ready, textures, getImageUrl, getMeta } = useTerreData()
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) return <div className="terre-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading /></div>

  const meta = expandedIndex !== null ? getMeta(expandedIndex) : null

  return (
    <div className="terre-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <TerreScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {meta && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={getImageUrl(expandedIndex)} onClose={handleClose} title={meta.title} author={meta.artist} />
        </div>
      )}
    </div>
  )
}

export default Terre
