import { useState, useEffect } from 'react'
import { isDevelopment } from './env'


const ROWS = 8
const COLS = 14
const COUNT = ROWS * COLS
const API_BASE = isDevelopment
  ? '/met-api'
  : 'https://collectionapi.metmuseum.org/public/collection/v1';
const PARALLEL_BATCH = 8
const DISPLAY_BATCH = 10
const MAX_ITERATIONS = 200
const BATCH_DELAY = 200

let cachedArtworks = null
let cachedReady = false
let cachedIds = null
let cachedIdIndex = 0

async function fetchAllIds(apiBase) {
  if (cachedIds) return cachedIds
  const queries = [
    'painting', 'landscape', 'portrait', 'sculpture',
    'flower', 'still+life', 'drawing', 'watercolor',
  ]
  const results = await Promise.allSettled(
    queries.map((q) =>
      fetch(`${apiBase}/search?q=${q}&isPublicDomain=true&hasImages=true`)
        .then((r) => r.json())
        .then((d) => d.objectIDs || [])
    )
  )
  const seen = new Set()
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const id of r.value) seen.add(id)
    }
  }
  const ids = [...seen]
  ids.sort(() => Math.random() - 0.5)
  cachedIds = ids.slice(0, COUNT * 2)
  return cachedIds
}

export default function useMetropolitanData() {
  const [artworks, setArtworks] = useState(() => cachedArtworks || [])
  const [ready, setReady] = useState(() => cachedReady || false)
  const [loadingError, setLoadingError] = useState(null)

  useEffect(() => {
    if (cachedArtworks?.length >= COUNT) return

    let cancelled = false

    const fetchArtworks = async () => {
      try {
        const ids = await fetchAllIds(API_BASE)

        const allItems = cachedArtworks ? [...cachedArtworks] : []
        let lastUpdate = allItems.length

        const maxIdIndex = Math.min(ids.length, MAX_ITERATIONS * PARALLEL_BATCH)
        for (let i = cachedIdIndex; i < maxIdIndex && allItems.length < COUNT && !cancelled; i++) {
          cachedIdIndex = i + 1
          const id = ids[i]
          const data = await fetch(`${API_BASE}/objects/${id}`)
            .then((r) => r.json())
            .catch(() => null)
          await new Promise((r) => setTimeout(r, BATCH_DELAY))
          const img = data?.primaryImageSmall || data?.primaryImage
          if (data && img) {
            allItems.push({
              imageUrl: img,
              title: data.title || 'Untitled',
              artist: data.artistDisplayName || 'Unknown Artist',
              year: data.objectDate || 'Unknown Year',
            })
          }

          if (!cancelled && allItems.length - lastUpdate >= DISPLAY_BATCH) {
            lastUpdate = allItems.length
            cachedArtworks = [...allItems]
            cachedReady = true
            setArtworks([...allItems])
            setReady(true)
          }
        }

        if (!cancelled) {
          cachedArtworks = allItems
          cachedReady = true
          setArtworks(allItems)
          setReady(true)
        }
      } catch (e) {
        if (!cancelled) { setReady(true); setLoadingError(e?.message) }
      }
    }

    fetchArtworks()
    return () => { cancelled = true }
  }, [])

  return {
    ready,
    artworks,
    textures: [],
    loadingError,
    getImageUrl: (i) => artworks[i]?.imageUrl || null,
    getMeta: (i) => artworks[i]
      ? { title: artworks[i].title, artist: artworks[i].artist, year: artworks[i].year }
      : null,
  }
}
