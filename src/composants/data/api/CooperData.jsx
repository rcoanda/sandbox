import useSwappableData from '../useSwappableData'
import { isDevelopment } from './env'

const COUNT = 120

const COOPER_API = isDevelopment ? '/cooper-api' : 'https://apidocs.cooperhewitt.org/graphql-api'
const COOPER_IMG = isDevelopment ? '/cooper-img' : 'https://ciim-static-media.s3.us-east-1.amazonaws.com'

const COOPER_QUERY = `{
  object(hasImages: true, size: ${COUNT}) {
    id
    summary
    date
    multimedia
    agent { summary }
  }
}`

function fetchCooperObjects() {
  return fetch(COOPER_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: COOPER_QUERY }),
  })
    .then(r => r.json())
    .then(d => (d.data || {}).object || [])
}

function getPreview(item) {
  const media = item.multimedia || []
  return media[0]?.preview || null
}

function getMediaUrl(item) {
  const preview = getPreview(item)
  if (!preview) return null
  const path = preview.url || preview.location
  if (!path) return null
  if (path.includes('://')) {
    return path.replace('https://ciim-static-media.s3.us-east-1.amazonaws.com', COOPER_IMG)
  }
  return `${COOPER_IMG}/${path}`
}

function isValid(item) {
  return !!getMediaUrl(item)
}

function makeMeta(item) {
  return {
    title: (item.summary && item.summary.title) || 'Untitled',
    artist: (item.agent && item.agent[0] && item.agent[0].summary && item.agent[0].summary.title) || 'Unknown Designer',
    year: (item.date && item.date[0] && item.date[0].value) || 'Unknown Year',
  }
}

export default function useCooperData() {
  return useSwappableData({
    cacheKey: 'cooper',
    loadInitial: async () => {
      const items = await fetchCooperObjects()
      const valid = items.filter(isValid)
      if (valid.length < 10) throw new Error("API Cooper Hewitt ne répond pas. Réitérez votre demande.")
      const selected = valid.slice(0, COUNT)
      return { items: selected, total: selected.length }
    },
    getImageUrl: item => getMediaUrl(item),
    getMeta: item => makeMeta(item),
    getOne: async () => {
      const items = await fetchCooperObjects()
      return items.find(isValid) || null
    },
  })
}
