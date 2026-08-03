import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { isDevelopment } from './env'

const caches = {}

function getCache(key) {
  if (!caches[key]) caches[key] = { textures: null, meta: null }
  return caches[key]
}

export default function useTextureLoader({ cacheKey, loadFn, getMetaFn }) {
  const cache = getCache(cacheKey)

  const [textures, setTextures] = useState(cache.textures || [])
  const [ready, setReady] = useState(!!cache.textures)
  const [imageMeta, setImageMeta] = useState(cache.meta || [])
  const [loadingError, setLoadingError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (cache.textures) return

    const mounted = { current: true }
    const controller = new AbortController()
    const loader = new THREE.TextureLoader()
    if (isDevelopment) loader.crossOrigin = 'anonymous'

    Promise.resolve(loadFn(controller.signal)).then(({ urls, meta }) => {
      if (cache.textures) return
      cache.meta = meta
      if (mounted.current) setImageMeta(meta)

      let loaded = 0
      let successCount = 0
      const tex = []

      const onLoad = () => {
        loaded++
        if (loaded >= urls.length) {
          cache.textures = tex
          cache.meta = meta
          if (mounted.current) {
            setTextures(tex)
            setReady(true)
          }
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

      timerRef.current = setTimeout(() => {
        if (mounted.current && successCount > 0 && !cache.textures) {
          cache.textures = tex
          cache.meta = meta
          setTextures(tex)
          setReady(true)
        }
      }, 20000)
    }).catch((e) => {
      if (mounted.current) setLoadingError(e?.message)
    })

    return () => {
      mounted.current = false
      controller.abort()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [cacheKey, loadFn, cache])

  return {
    ready,        // Booléen — vrai quand toutes les textures sont chargées
    textures,     // Tableau de THREE.Texture
    loadingError, // String | null — message d'erreur si le chargement a échoué
    getImageUrl: (i) => imageMeta[i]?.url || null, // (i) => string | null — URL de l'image
    getMeta: (i) => getMetaFn(imageMeta[i], i),     // (i) => { title, artist, year } | null
  }
}
