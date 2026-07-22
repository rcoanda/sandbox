import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

const N = 3
const TOTAL = N * N * N
const BATCH_SIZE = 100
const DELAY_BETWEEN_IMAGES = 1000
const REFILL_INTERVAL = 30000
const REFILL_THRESHOLD = 10

function preloadTexture(url) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(url, (t) => resolve(t), undefined, () => resolve(null))
  })
}

async function fetchCandidates(count = BATCH_SIZE) {
  const p = new URLSearchParams()
  p.set('limit', count)
  p.set('page', 1)
  p.set('fields', 'id,image_id,title,artist_display,date_display')
  p.set('query[term][is_public_domain]', 'true')
  const res = await fetch(`/chicago-api/api/v1/artworks/search?${p}`)
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
  return `/chicago-img/iiif/2/${imageId}/full/843,/0/default.jpg`
}

function pickFromPool(pool) {
  const avail = pool.slice(TOTAL)
  if (avail.length === 0) return null
  const idx = Math.floor(Math.random() * avail.length)
  return { item: avail[idx], poolIdx: TOTAL + idx }
}

export default function useChicagoData() {
  const [textures, setTextures] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [artworkMetas, setArtworkMetas] = useState([])
  const [loadingError, setLoadingError] = useState(null)
  const swapCancelled = useRef(false)
  const pool = useRef([])
  const ready = textures.length === TOTAL

  useEffect(() => {
    let cancelled = false
    fetchCandidates(BATCH_SIZE)
      .then(candidates => {
        if (cancelled) return
        if (candidates.length < TOTAL) throw new Error('Not enough public domain artworks')
        pool.current = candidates
        const selected = candidates.slice(0, TOTAL)
        setImageUrls(selected.map(item => imgUrl(item.image_id)))
        setArtworkMetas(selected.map(makeMeta))
        return Promise.all(selected.map(item => preloadTexture(imgUrl(item.image_id))))
      })
      .then(texs => { if (!cancelled && texs) setTextures(texs) })
      .catch(e => { if (!cancelled) setLoadingError(e.message) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!ready) return
    const id = setInterval(async () => {
      if (pool.current.length - TOTAL < REFILL_THRESHOLD) {
        try {
          const fresh = await fetchCandidates()
          pool.current = pool.current.slice(0, TOTAL).concat(fresh)
        } catch {}
      }
    }, REFILL_INTERVAL)
    return () => clearInterval(id)
  }, [ready])

  useEffect(() => {
    if (textures.length < TOTAL) return
    swapCancelled.current = false

    const swapLoop = async () => {
      while (!swapCancelled.current) {
        const idx = Math.floor(Math.random() * TOTAL)
        const pick = pickFromPool(pool.current)
        if (!pick) {
          await new Promise(r => setTimeout(r, DELAY_BETWEEN_IMAGES))
          continue
        }
        pool.current.splice(pick.poolIdx, 1)
        const url = imgUrl(pick.item.image_id)
        const tex = await preloadTexture(url)
        if (!swapCancelled.current) {
          setImageUrls(prev => { const next = [...prev]; next[idx] = url; return next })
          setArtworkMetas(prev => { const next = [...prev]; next[idx] = makeMeta(pick.item); return next })
          setTextures(prev => {
            const next = [...prev]
            if (next[idx]) next[idx].dispose()
            next[idx] = tex
            return next
          })
        }
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_IMAGES))
      }
    }

    swapLoop()
    return () => { swapCancelled.current = true }
  }, [textures.length])

  return {
    ready,
    textures,
    count: TOTAL,
    getImageUrl: (i) => imageUrls[i] || null,
    getMeta: (i) => artworkMetas[i] || null,
    loadingError,
  }
}
