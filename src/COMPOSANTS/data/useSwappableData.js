import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

const caches = {}

function defaultPreload(url) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(url, (t) => resolve(t), undefined, () => resolve(null))
  })
}

export default function useSwappableData({
  cacheKey,
  loadInitial,
  getImageUrl,
  getMeta,
  getOne,
  preload = defaultPreload,
  swapDelay = 1000,
}) {
  if (!caches[cacheKey]) caches[cacheKey] = {}
  const cache = caches[cacheKey]

  const [textures, setTextures] = useState(cache.textures || [])
  const [imageUrls, setImageUrls] = useState(cache.imageUrls || [])
  const [artworkMetas, setArtworkMetas] = useState(cache.artworkMetas || [])
  const [total, setTotal] = useState(cache.total || 0)
  const [loadingError, setLoadingError] = useState(null)
  const swapCancelled = useRef(false)
  const ready = cache.textures ? true : (textures.length >= total && total > 0)

  useEffect(() => {
    if (cache.textures) return
    let cancelled = false
    loadInitial()
      .then(result => {
        if (cancelled) return
        const items = result.items
        const n = result.total || items.length
        const urls = items.map(getImageUrl)
        const metas = items.map(getMeta)
        cache.total = n
        cache.imageUrls = urls
        cache.artworkMetas = metas
        setTotal(n)
        setImageUrls(urls)
        setArtworkMetas(metas)
        return Promise.all(items.map(item => preload(getImageUrl(item))))
      })
      .then(texs => {
        if (!cancelled && texs) {
          cache.textures = texs
          setTextures(texs)
        }
      })
      .catch(e => { if (!cancelled) { console.error(e); setLoadingError(e.message) } })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (textures.length < total || total === 0) return
    swapCancelled.current = false

    const loop = async () => {
      while (!swapCancelled.current) {
        const idx = Math.floor(Math.random() * total)
        try {
          const item = await getOne()
          if (item && !swapCancelled.current) {
            const url = getImageUrl(item)
            const tex = await preload(url)
            if (!swapCancelled.current) {
              setImageUrls(prev => { const next = [...prev]; next[idx] = url; cache.imageUrls = next; return next })
              setArtworkMetas(prev => { const next = [...prev]; next[idx] = getMeta(item); cache.artworkMetas = next; return next })
              setTextures(prev => {
                const next = [...prev]
                if (next[idx]) next[idx].dispose()
                next[idx] = tex
                cache.textures = next
                return next
              })
            }
          }
        } catch {}
        if (swapCancelled.current) return
        await new Promise(r => setTimeout(r, swapDelay))
      }
    }

    loop()
    return () => { swapCancelled.current = true }
  }, [textures.length, total])

  return {
    ready,        // Booléen — vrai quand toutes les textures sont chargées
    textures,     // Tableau de THREE.Texture
    loadingError, // String | null — message d'erreur si le chargement a échoué
    getImageUrl: (i) => imageUrls[i] || null,       // (i) => string | null — URL de l'image
    getMeta: (i) => artworkMetas[i] || null,        // (i) => { title, artist, year } | null
  }
}
