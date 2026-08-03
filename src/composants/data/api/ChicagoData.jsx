import { useRef, useEffect } from 'react'
import useSwappableData from '../useSwappableData'
import { isDevelopment } from './env'

const CHICAGO_API = isDevelopment ? '/chicago-api' : 'https://api.artic.edu'
const CHICAGO_IMG = isDevelopment ? '/chicago-img' : 'https://www.artic.edu'

const N = 3
const COUNT = N * N * N
const BATCH_SIZE = 100
const REFILL_INTERVAL = 30000
const REFILL_THRESHOLD = 10

async function fetchCandidates(count = BATCH_SIZE) {
  const p = new URLSearchParams()
  p.set('limit', count)
  p.set('page', 1)
  p.set('fields', 'id,image_id,title,artist_display,date_display')
  p.set('query[term][is_public_domain]', 'true')
  const res = await fetch(`${CHICAGO_API}/api/v1/artworks/search?${p}`)
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  const d = await res.json()
  return (d?.data || []).filter(item => item.image_id)
}

function makeMeta(item) {
  return {
    title: item.title || 'Untitled',
    artist: (item.artist_display || '').split('\n')[0].trim() || 'Unknown Artist',
    year: item.date_display || 'Unknown Year',
  }
}

function imgUrl(imageId) {
  return `${CHICAGO_IMG}/iiif/2/${imageId}/full/843,/0/default.jpg`
}

export default function useChicagoData() {
  const pool = useRef([])
  const hook = useSwappableData({
    cacheKey: 'chicago',
    loadInitial: async () => {
      const candidates = await fetchCandidates(BATCH_SIZE)
      if (candidates.length < COUNT) throw new Error('Not enough public domain artworks')
      pool.current = candidates
      return { items: candidates.slice(0, COUNT), total: COUNT }
    },
    getImageUrl: item => imgUrl(item.image_id),
    getMeta: item => makeMeta(item),
    getOne: async () => {
      const avail = pool.current.slice(COUNT)
      if (avail.length === 0) return null
      const i = Math.floor(Math.random() * avail.length)
      const item = avail[i]
      pool.current.splice(COUNT + i, 1)
      return item
    },
  })

  useEffect(() => {
    if (!hook.ready) return
    const id = setInterval(async () => {
      if (pool.current.length - COUNT < REFILL_THRESHOLD) {
        try {
          const fresh = await fetchCandidates()
          pool.current = pool.current.slice(0, COUNT).concat(fresh)
        } catch { /* empty */ }
      }
    }, REFILL_INTERVAL)
    return () => clearInterval(id)
  }, [hook.ready])

  return hook
}
