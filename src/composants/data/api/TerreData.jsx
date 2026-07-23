import useTextureLoader from './TextureLoader'

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

const LAYER_META = {
  BlueMarble_ShadedRelief_Bathymetry: {
    title: 'Blue Marble Shaded Relief with Bathymetry',
    artist: 'NASA Earth Observatory',
    date: 'MODIS composite 2004',
  },
  MODIS_Terra_CorrectedReflectance_TrueColor: {
    title: 'Corrected Reflectance True Color',
    artist: 'MODIS / Terra (EOS AM-1)',
    date: 'Daily satellite imagery',
  },
  VIIRS_SNPP_CorrectedReflectance_TrueColor: {
    title: 'Corrected Reflectance True Color',
    artist: 'VIIRS / Suomi NPP',
    date: 'Daily satellite imagery',
  },
  BlueMarble_NextGeneration: {
    title: 'Blue Marble Next Generation',
    artist: 'NASA Earth Observatory',
    date: 'Monthly composite 2004',
  },
  'VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1': {
    title: 'Corrected Reflectance Bands M11-I2-I1',
    artist: 'VIIRS / Suomi NPP',
    date: 'Daily satellite imagery',
  },
  VIIRS_NOAA20_CorrectedReflectance_TrueColor: {
    title: 'Corrected Reflectance True Color',
    artist: 'VIIRS / NOAA-20 (JPSS-1)',
    date: 'Daily satellite imagery',
  },
  MODIS_Aqua_CorrectedReflectance_TrueColor: {
    title: 'Corrected Reflectance True Color',
    artist: 'MODIS / Aqua (EOS PM-1)',
    date: 'Daily satellite imagery',
  },
  BlueMarble_ShadedRelief: {
    title: 'Blue Marble Shaded Relief',
    artist: 'NASA Earth Observatory',
    date: 'MODIS composite 2004',
  },
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
  return useTextureLoader({
    cacheKey: 'terre',
    count: COUNT,
    loadFn: () => {
      const data = generateEarthData(COUNT)
      return { urls: data.map((d) => d.url), meta: data }
    },
    getMetaFn: (meta) => {
      if (!meta) return null
      const info = LAYER_META[meta.layer] || {}
      return {
        title: info.title || meta.layer,
        artist: info.artist || ERROR_LOAD_MSG,
        date: info.date || '',
        place: meta.bbox.length ? formatBbox(meta.bbox) : ERROR_LOAD_MSG,
      }
    },
  })
}
