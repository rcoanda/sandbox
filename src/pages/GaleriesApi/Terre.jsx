import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import TerreScene, { setPaused } from '../../composants/galeriesApi/TerreScene'
import '../../styles/galeriesApi/Terre.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'

const COUNT = 100
const ERROR_LOAD_MSG = 'NASA Earthdata GIBS'
const FALLBACK_LAYER = 'Earth image'

const LAYERS = [
  'BlueMarble_ShadedRelief_Bathymetry',
  'MODIS_Terra_CorrectedReflectance_TrueColor',
  'VIIRS_SNPP_CorrectedReflectance_TrueColor',
  'BlueMarble_NextGeneration',
  'VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1',
  'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
  'MODIS_Aqua_CorrectedReflectance_TrueColor',
  'BlueMarble_ShadedRelief',
]

function randomBbox() {
  const kinds = [
    () => {
      const lon = -180 + Math.random() * 360
      const lat = -60 + Math.random() * 120
      const w = 20 + Math.random() * 40
      const h = 15 + Math.random() * 30
      return [lon, lat, lon + w, lat + h]
    },
    () => {
      const lon = -180 + Math.random() * 360
      const lat = -60 + Math.random() * 120
      const w = 60 + Math.random() * 120
      const h = 40 + Math.random() * 50
      return [lon, lat, lon + w, lat + h]
    },
    () => [-180, -90, 180, 90],
  ]
  return kinds[Math.floor(Math.random() * kinds.length)]()
}

function formatLayer(layer) {
  return layer
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}

function formatCoord(v, pos, neg) {
  return `${Math.abs(v).toFixed(1)}°${v >= 0 ? pos : neg}`
}

function formatBbox(bbox) {
  const [west, south, east, north] = bbox
  return `${formatCoord(south, 'N', 'S')}–${formatCoord(north, 'N', 'S')}, ${formatCoord(west, 'E', 'W')}–${formatCoord(east, 'E', 'W')}`
}

function generateEarthData(count) {
  const data = []
  for (let i = 0; i < count; i++) {
    const layer = LAYERS[i % LAYERS.length]
    const bbox = randomBbox()
    const url = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=${layer}&CRS=EPSG:4326&BBOX=${bbox.join(',')}&WIDTH=600&HEIGHT=400&FORMAT=image/jpeg`
    data.push({ url, layer, bbox })
  }
  return data
}

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

function Terre() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [imageMeta, setImageMeta] = useState([])
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'

    const loadProcedural = () => {
      const tex = Array.from({ length: COUNT }, () => generateCosmicTexture())
      setTextures(tex)
      setImageMeta(tex.map((t) => ({ url: t.image.toDataURL(), layer: FALLBACK_LAYER, bbox: [] })))
      setReady(true)
    }

    const earthData = generateEarthData(COUNT)
    const urls = earthData.map((d) => d.url)

    Promise.resolve().then(() => setImageMeta(earthData))

    let loaded = 0
    let successCount = 0
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
        (t) => { tex[i] = t; onLoad(); successCount++ },
        undefined,
        () => onLoad()
      )
    })

    const timer = setTimeout(() => {
      if (successCount === 0) {
        loadProcedural()
      } else if (!ready) {
        setTextures(tex)
        setReady(true)
      }
    }, 20000)

    return () => clearTimeout(timer)
  }, [])

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

  if (!ready) return <div className="terre-page"><BackArrow /><Informations /><CategoryMenu category="galeriesApi" /><Loading /></div>

  return (
    <div className="terre-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 3, 9], fov: 50 }} dpr={[1, 2]}>
        <TerreScene textures={textures} onImageClick={handleImageClick} />
      </Canvas>
      {expandedIndex !== null && imageMeta[expandedIndex] && (
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
              <img src={imageMeta[expandedIndex].url} alt="" />
            </div>
            <div className="expanded-back">
              <span className="rect-back-title">{formatLayer(imageMeta[expandedIndex].layer)}</span>
              <span className="rect-back-artist">
                {imageMeta[expandedIndex].bbox.length
                  ? formatBbox(imageMeta[expandedIndex].bbox)
                  : ERROR_LOAD_MSG}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Terre
