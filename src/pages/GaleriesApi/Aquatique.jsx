import { useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import AquatiqueScene, { setPaused } from '../../composants/galeriesApi/AquatiqueScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Aquatique.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'

const ROBOFLOW_WORKSPACE = 'LhZe9xSpLbPGwPNJW8WEjUbVnE42'
const IMAGE_IDS = [
  '02dvzlug0lsJGDaxGUqD',
  '033btQqnrZTwL5D0NP2U',
  '03pD0wWWNhEWrcQyjC7n',
  '066JFtah5gKGJMdkrcrP',
  '07AC8JYpyzLojDqulBFc',
  '081bL1irbNI5QXkg9EBG',
  '0901LJmYlO2UVfXRoaMh',
]
const IMAGE_URLS = IMAGE_IDS.map(
  (id) => `/roboflow-img/${ROBOFLOW_WORKSPACE}/${id}/thumb.jpg`,
)

function Aquatique() {
  const [ready, setReady] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [expandedUrl, setExpandedUrl] = useState('')
  const expandedId = expandedIndex !== null ? IMAGE_IDS[expandedIndex] : ''

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
        <AquatiqueScene imageUrls={IMAGE_URLS} onImageClick={handleImageClick} onReady={() => setReady(true)} />
      </Canvas>
      {!ready && <Loading />}
      {expandedIndex !== null && expandedUrl && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={expandedUrl} onClose={handleClose}>
            <span className="rect-back-title">Aquatique #{expandedIndex !== null ? expandedIndex + 1 : ''}</span>
            <span className="rect-back-artist">{expandedId}</span>
          </Overlay>
        </div>
      )}
    </div>
  )
}

export default Aquatique
