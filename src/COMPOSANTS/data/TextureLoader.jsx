import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const caches = {}

export default function useTextureLoader({ cacheKey, count, loadFn, getMetaFn }) {
  if (!caches[cacheKey]) {
    caches[cacheKey] = { textures: null, meta: null }
  }
  const cache = caches[cacheKey]

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
    loader.crossOrigin = 'anonymous'

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
  }, [cacheKey])

  return {
    ready,
    textures,
    count,
    loadingError,
    getImageUrl: (i) => imageMeta[i]?.url || null,
    getMeta: (i) => getMetaFn(imageMeta[i], i),
  }
}
