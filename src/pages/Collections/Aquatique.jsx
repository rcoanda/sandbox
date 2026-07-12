import { useState, useCallback, useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import AquatiqueScene, { setPaused } from '../../composants/collections/AquatiqueScene'
import '../../styles/collections/Aquatique.css'

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

function Scene({ onImageClick }) {
  const textures = useTexture(IMAGE_URLS)
  return <AquatiqueScene textures={textures} onImageClick={onImageClick} />
}

function Aquatique() {
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setFlipped(false)
    setPaused(false)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(flipTimerRef.current)
      setFlipped(false)
    }
  }, [expandedIndex])

  return (
    <div className="aquatique-page">
      <BackArrow />
      <CategoryMenu category="collections" />
      <Canvas camera={{ position: [0, 5, 7], fov: 50, up: [0, 1, 0] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Scene onImageClick={handleImageClick} />
        </Suspense>
      </Canvas>
      {expandedIndex !== null && (
        <div className="expanded-rect">
          <div
            className={'expanded-inner' + (flipped ? ' flipped' : '')}
            onMouseEnter={() => {
              flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
            }}
            onMouseMove={() => {
              if (flipped) return
              clearTimeout(flipTimerRef.current)
              flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
            }}
            onMouseLeave={() => {
              clearTimeout(flipTimerRef.current)
              setFlipped(false)
            }}
          >
            <div className="expanded-front">
              <img src={IMAGE_URLS[expandedIndex % IMAGE_URLS.length]} alt="" />
            </div>
            <div className="expanded-back">
              <span className="rect-back-title">Underwater Photo</span>
              <span className="rect-back-artist">Roboflow Universe</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Aquatique
