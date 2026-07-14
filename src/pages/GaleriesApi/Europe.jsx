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

function generateCosmicTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const hue = Math.random() * 360
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  grad.addColorStop(0, `hsla(${hue + Math.random() * 60}, 80%, 35%, 1)`)
  grad.addColorStop(0.3, `hsla(${hue + 30 + Math.random() * 60}, 60%, 15%, 0.9)`)
  grad.addColorStop(0.7, `hsla(${hue + 60}, 40%, 8%, 0.8)`)
  grad.addColorStop(1, `hsla(0, 0%, 3%, 1)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = Math.random() * 2.5
    const a = 0.3 + Math.random() * 0.7
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`
    ctx.fill()
  }

  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = 2 + Math.random() * 4
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3)
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6)
    ctx.beginPath()
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = 'srgb'
  return texture
}

function Europe() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    const loader = new THREE.TextureLoader()

    const loadProcedural = () => {
      const tex = Array.from({ length: COUNT }, () => generateCosmicTexture())
      setTextures(tex)
      setReady(true)
    }

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
          loadProcedural()
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
            () => {
              tex[i] = generateCosmicTexture()
              onLoad()
            }
          )
        })
      })
      .catch(() => loadProcedural())
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
