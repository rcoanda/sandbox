import { useState, useEffect } from 'react'
import * as THREE from 'three'

const COUNT = 60

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export default function useClevelandData() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [artworkMetas, setArtworkMetas] = useState([])

  useEffect(() => {
    fetch('https://openaccess-api.clevelandart.org/api/artworks?has_image=1&limit=60')
      .then((res) => res.json())
      .then(async (data) => {
        const metas = (data.data || []).map((item) => ({
          title: item.title || 'Untitled',
          artist: item.creators?.[0]?.description || 'Unknown Artist',
          year: item.creation_date || 'Unknown Year',
        }))

        const urls = (data.data || [])
          .map((item) => {
            const web = item.images?.web?.url
            const print = item.images?.print?.url
            const original = web || print
            if (!original) return null
            return original.replace('https://openaccess-cdn.clevelandart.org', '/cma')
          })
          .filter(Boolean)

        if (urls.length < 10) return

        setArtworkMetas(metas.slice(0, urls.length))
        setImageUrls(urls)

        const images = await Promise.all(urls.map(loadImage))
        const valid = images.filter(Boolean)

        if (valid.length < 10) return

        const tex = valid.map((img) => {
          const t = new THREE.Texture(img)
          t.colorSpace = 'srgb'
          t.needsUpdate = true
          return t
        })
        setTextures(tex)
        setReady(true)
      })
      .catch(() => {})
  }, [])

  return {
    ready,
    textures,
    count: COUNT,
    getImageUrl: (i) => imageUrls[i] || null,
    getMeta: (i) => artworkMetas[i] || null,
  }
}
