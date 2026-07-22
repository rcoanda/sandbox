import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

const N = 3
const DELAY_BETWEEN_IMAGES = 1000

function preloadTexture(url) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(url, (t) => resolve(t), undefined, () => resolve(null))
  })
}

export default function useChicagoData() {
  const [textures, setTextures] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [artworkMetas, setArtworkMetas] = useState([])
  const swapCancelled = useRef(false)
  const ready = textures.length >= N * N * N

  useEffect(() => {
    const page = Math.floor(Math.random() * 1000) + 1
    fetch(`https://api.artic.edu/api/v1/artworks/search?limit=27&page=${page}&fields=id,image_id,title,artist_display,date_display&query[term][is_public_domain]=true`)
      .then(r => r.json())
      .then(d => {
        if (!d?.data) return
        const items = d.data.filter(item => item.image_id)
        if (items.length >= N * N * N) {
          const selected = items.slice(0, N * N * N)
          setImageUrls(selected.map(item => `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`))
          setArtworkMetas(selected.map(item => ({
            title: item.title || 'Untitled',
            artist: (item.artist_display || '').split('\n')[0].trim() || 'Unknown Artist',
            year: item.date_display || 'Unknown Year',
          })))
          Promise.all(selected.map(item => preloadTexture(`https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`))).then(setTextures)
        }
      })
  }, [])

  useEffect(() => {
    if (textures.length < N * N * N) return
    swapCancelled.current = false

    const swapLoop = async () => {
      while (!swapCancelled.current) {
        const idx = Math.floor(Math.random() * N * N * N)
        const page = Math.floor(Math.random() * 1000) + 1
        try {
          const res = await fetch(
            `https://api.artic.edu/api/v1/artworks/search?limit=1&page=${page}&fields=id,image_id,title,artist_display,date_display&query[term][is_public_domain]=true`
          )
          const d = await res.json()
          const item = d.data.find((i) => i.image_id)
          if (item && !swapCancelled.current) {
            const url = `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
            const tex = await preloadTexture(url)
            if (!swapCancelled.current) {
              setImageUrls((prev) => {
                const next = [...prev]
                next[idx] = url
                return next
              })
              setArtworkMetas((prev) => {
                const next = [...prev]
                next[idx] = {
                  title: item.title || 'Untitled',
                  artist: (item.artist_display || '').split('\n')[0].trim() || 'Unknown Artist',
                  year: item.date_display || 'Unknown Year',
                }
                return next
              })
              setTextures((prev) => {
                const next = [...prev]
                if (next[idx]) next[idx].dispose()
                next[idx] = tex
                return next
              })
            }
          }
        } catch {}
        if (swapCancelled.current) return
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_IMAGES))
      }
    }

    swapLoop()
    return () => { swapCancelled.current = true }
  }, [textures.length])

  return {
    ready,
    textures,
    count: N * N * N,
    getImageUrl: (i) => imageUrls[i] || null,
    getMeta: (i) => artworkMetas[i] || null,
  }
}
