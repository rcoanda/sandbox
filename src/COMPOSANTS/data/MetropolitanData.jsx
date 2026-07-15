import { useState, useEffect } from 'react'

const ROWS = 8
const COLS = 14
const TOTAL = ROWS * COLS
const API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'
const FETCH_LIMIT = 10//ROWS * COLS

let cachedArtworks = null
let cachedReady = false

export default function useMetropolitanData() {
  const [artworks, setArtworks] = useState(() => cachedArtworks || [])
  const [ready, setReady] = useState(() => cachedReady || false)

  useEffect(() => {
    if (cachedArtworks) return

    let cancelled = false

    const fetchArtworks = async () => {
      try {
        const searchRes = await fetch(
          `${API_BASE}/search?q=art&isPublicDomain=true&hasImages=true`
        )
        const searchData = await searchRes.json()
        const ids = searchData.objectIDs || []

        const items = []
        for (let i = 0; i < ids.length && items.length < TOTAL; i += 5) {
          const batch = ids.slice(i, i + 5)
          const results = await Promise.allSettled(
            batch.map((id) =>
              fetch(`${API_BASE}/objects/${id}`).then((r) => r.json())
            )
          )
          for (const r of results) {
            if (r.status === 'fulfilled' && r.value.primaryImageSmall) {
              items.push({
                imageUrl: r.value.primaryImageSmall,
                title: r.value.title || 'Untitled',
                artist: r.value.artistDisplayName || 'Unknown Artist',
                year: r.value.objectDate || 'Unknown Year',
              })
              if (items.length >= FETCH_LIMIT) break
            }
          }
        }

        if (!cancelled) {
          cachedArtworks = items
          cachedReady = true
          setArtworks(items)
          setReady(true)
        }
      } catch {
        if (!cancelled) { setReady(true) }
      }
    }

    fetchArtworks()
    return () => { cancelled = true }
  }, [])

  return {
    ready,
    artworks,
    textures: [],
    count: TOTAL,
    getImageUrl: (i) => artworks[i]?.imageUrl || null,
    getMeta: (i) => artworks[i]
      ? { title: artworks[i].title, artist: artworks[i].artist, year: artworks[i].year }
      : null,
  }
}
