import { useState, useCallback, useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import AquatiqueScene, { setPaused } from '../../composants/collections/AquatiqueScene'
import '../../styles/collections/Aquatique.css'
import Informations from '../../composants/Informations'

const ROBOFLOW_WORKSPACE = 'LhZe9xSpLbPGwPNJW8WEjUbVnE42'
const IMAGE_DATA = [
  { id: '02dvzlug0lsJGDaxGUqD', title: 'Coral Garden', lieu: 'Great Barrier Reef', auteur: 'S. Marinus', date: '2023-03-12' },
  { id: '033btQqnrZTwL5D0NP2U', title: 'Deep Wreck', lieu: 'Truk Lagoon', auteur: 'M. Delacroix', date: '2022-11-05' },
  { id: '03pD0wWWNhEWrcQyjC7n', title: 'Manta Ray Dance', lieu: 'Maldives', auteur: 'A. Nakamura', date: '2023-07-21' },
  { id: '066JFtah5gKGJMdkrcrP', title: 'Kelp Forest', lieu: 'California Coast', auteur: 'J. Erikson', date: '2022-09-14' },
  { id: '07AC8JYpyzLojDqulBFc', title: 'Neon Nudibranch', lieu: 'Raja Ampat', auteur: 'L. Chen', date: '2023-01-30' },
  { id: '081bL1irbNI5QXkg9EBG', title: 'Shipwreck Silence', lieu: 'Red Sea', auteur: 'K. Hassan', date: '2022-06-18' },
  { id: '0901LJmYlO2UVfXRoaMh', title: 'Jellyfish Bloom', lieu: 'Palau', auteur: 'T. Yamamoto', date: '2023-09-02' },
]
const IMAGE_URLS = IMAGE_DATA.map(
  (data) => `/roboflow-img/${ROBOFLOW_WORKSPACE}/${data.id}/thumb.jpg`,
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
      <Informations />
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
              <span className="rect-back-title">{IMAGE_DATA[expandedIndex % IMAGE_DATA.length].title}</span>
              <span className="rect-back-lieu">{IMAGE_DATA[expandedIndex % IMAGE_DATA.length].lieu}</span>
              <div className="rect-back-meta">
                <span className="rect-back-artist">{IMAGE_DATA[expandedIndex % IMAGE_DATA.length].auteur}</span>
                <span className="rect-back-date">{IMAGE_DATA[expandedIndex % IMAGE_DATA.length].date}</span>
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Aquatique
