import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import ClevelandScene, { setPaused } from '../../composants/galeriesApi/ClevelandScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Cleveland.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'

const COUNT = 60

function Cleveland() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [imageUrls, setImageUrls] = useState([])
  const [artworkMetas, setArtworkMetas] = useState([])

  useEffect(() => {
    fetch('https://openaccess-api.clevelandart.org/api/artworks?has_image=1&limit=60')
      .then((res) => res.json())
      .then(async (data) => {
        const metas = (data.data || []).map((item) => ({
          title: item.title || 'Untitled',
          artist: item.creators?.[0]?.description || 'Unknown Artist',
          year: item.creation_date || 'Unknown Year',
        }))

        const urls = (data.data || [])
          .map((item) => {
            const web = item.images?.web?.url
            const print = item.images?.print?.url
            const original = web || print
            if (!original) return null
            return original.replace('https://openaccess-cdn.clevelandart.org', '/cma')
          })
          .filter(Boolean)

        if (urls.length < 10) {
          return
        }

        setArtworkMetas(metas.slice(0, urls.length))
        setImageUrls(urls)

        const loadImage = (url) =>
          new Promise((resolve) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = () => resolve(null)
            img.src = url
          })

        const images = await Promise.all(urls.map(loadImage))
        const valid = images.filter(Boolean)

        if (valid.length < 10) {
          return
        }

        const tex = valid.map((img) => {
          const t = new THREE.Texture(img)
          t.colorSpace = 'srgb'
          t.needsUpdate = true
          return t
        })
        setTextures(tex)
        setReady(true)
      })
      .catch(() => {})
  }, [])

  const handleImageClick = useCallback((index) => {
    setPaused(true)
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setPaused(false)
  }, [])

  if (!ready) return <div className="cleveland-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading /></div>

  return (
    <div className="cleveland-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <ClevelandScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {expandedIndex !== null && imageUrls[expandedIndex] && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={imageUrls[expandedIndex]} onClose={handleClose}>
            <span className="rect-back-title">{artworkMetas[expandedIndex]?.title || 'Untitled'}</span>
            <span className="rect-back-artist">{artworkMetas[expandedIndex]?.artist || 'Unknown Artist'}</span>
            <span className="rect-back-year">{artworkMetas[expandedIndex]?.year || 'Unknown Year'}</span>
          </Overlay>
        </div>
      )}
    </div>
  )
}

export default Cleveland
