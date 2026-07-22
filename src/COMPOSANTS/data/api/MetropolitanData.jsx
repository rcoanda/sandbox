import { useState, useEffect } from 'react'

const ROWS = 8
const COLS = 14
const COUNT = ROWS * COLS
const API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'
const PARALLEL_BATCH = 5
const DISPLAY_BATCH = 10

let cachedArtworks = null
let cachedReady = false

export default function useMetropolitanData() {
  const [artworks, setArtworks] = useState(() => cachedArtworks || [])
  const [ready, setReady] = useState(() => cachedReady || false)
  const [loadingError, setLoadingError] = useState(null)

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

        const allItems = []
        let lastUpdate = 0

        for (let i = 0; i < ids.length && allItems.length < COUNT && !cancelled; i += PARALLEL_BATCH) {
          const batch = ids.slice(i, i + PARALLEL_BATCH)
          const results = await Promise.allSettled(
            batch.map((id) =>
              fetch(`${API_BASE}/objects/${id}`).then((r) => r.json())
            )
          )
          for (const r of results) {
            if (r.status === 'fulfilled' && r.value.primaryImageSmall) {
              allItems.push({
                imageUrl: r.value.primaryImageSmall,
                title: r.value.title || 'Untitled',
                artist: r.value.artistDisplayName || 'Unknown Artist',
                year: r.value.objectDate || 'Unknown Year',
              })
            }
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
    ready,        // Booléen — vrai quand toutes les données sont chargées
    artworks,     // Tableau des œuvres (objet complet)
    textures: [], // Tableau de THREE.Texture (vide ici, utilisation DOM)
    loadingError, // String | null — message d'erreur si le chargement a échoué
    getImageUrl: (i) => artworks[i]?.imageUrl || null,              // (i) => string | null
    getMeta: (i) => artworks[i]
      ? { title: artworks[i].title, artist: artworks[i].artist, year: artworks[i].year }
      : null,                                                       // (i) => { title, artist, year } | null
  }
}
