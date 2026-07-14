import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import EuropeScene, { setPaused } from '../../composants/galeriesApi/EuropeScene'
import Overlay from '../../composants/Overlay'
import '../../styles/galeriesApi/Europe.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'

const COUNT = 60

function Europe() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    const loader = new THREE.TextureLoader()

    const PERMISSIVE = [
      'creativecommons.org/publicdomain',
      'creativecommons.org/licenses/zero',
      'creativecommons.org/licenses/by/',
      'creativecommons.org/licenses/by-sa/',
    ]

    const isPermissive = (rights) => {
      if (!rights) return false
      const url = Array.isArray(rights) ? rights[0] : rights
      return PERMISSIVE.some((p) => url.includes(p))
    }

    fetch('https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=*:*&media=true&thumbnail=true&rows=60')
      .then((res) => res.json())
      .then((data) => {
        const items = (data.items || []).filter((item) => isPermissive(item.rights))
        const urls = items
          .map((item) => {
            const preview = Array.isArray(item.edmPreview) ? item.edmPreview[0] : item.edmPreview
            const shownBy = Array.isArray(item.edmIsShownBy) ? item.edmIsShownBy[0] : item.edmIsShownBy
            const obj = Array.isArray(item.edmObject) ? item.edmObject[0] : item.edmObject
            return preview || shownBy || obj
          })
          .filter(Boolean)

        if (urls.length < 10) {
          return
        }

        setImageUrls(urls)

        let loaded = 0
        const tex = []
        const onLoad = () => {
          loaded++
          if (loaded >= urls.length) {
            setTextures(tex)
            setReady(true)
          }
        }

        urls.forEach((url, i) => {
          loader.load(
            url,
            (t) => {
              tex[i] = t
              onLoad()
            },
            undefined,
            () => onLoad()
          )
        })
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

  if (!ready) return <div className="europe-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading /></div>

  return (
    <div className="europe-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <EuropeScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {expandedIndex !== null && imageUrls[expandedIndex] && (
        <div className="expanded-rect">
          <Overlay key={expandedIndex} imageSrc={imageUrls[expandedIndex]} onClose={handleClose}>
            <span className="rect-back-title">Europeana</span>
            <span className="rect-back-artist">Cultural Heritage</span>
          </Overlay>
        </div>
      )}
    </div>
  )
}

export default Europe
