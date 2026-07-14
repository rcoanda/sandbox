import { useState, useEffect } from 'react'
import * as THREE from 'three'

const COUNT = 100
const ERROR_LOAD_MSG = 'NASA Earthdata GIBS'

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

export default function useTerreData() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [imageMeta, setImageMeta] = useState([])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'

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
      if (successCount > 0 && !ready) {
        setTextures(tex)
        setReady(true)
      }
    }, 20000)

    return () => clearTimeout(timer)
  }, [])

  return {
    ready,
    textures,
    count: COUNT,
    getImageUrl: (i) => imageMeta[i]?.url || null,
    getMeta: (i) => {
      const meta = imageMeta[i]
      if (!meta) return null
      return {
        title: formatLayer(meta.layer),
        artist: meta.bbox.length ? formatBbox(meta.bbox) : ERROR_LOAD_MSG,
      }
    },
  }
}
