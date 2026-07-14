import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

const COUNT = 120
const DELAY_BETWEEN_IMAGES = 1000

function proxyImg(url) {
  return url && url.includes('ciim-static-media.s3.us-east-1.amazonaws.com')
    ? url.replace('https://ciim-static-media.s3.us-east-1.amazonaws.com', '/cooper-img')
    : url
}

function preloadTexture(url) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(proxyImg(url), (t) => resolve(t), undefined, () => resolve(null))
  })
}

const COOPER_QUERY = `{
  object(hasImages: true, size: 120) {
    id
    summary
    date
    multimedia {
      cc0
      preview { url }
    }
    agent { summary }
  }
}`

function fetchCooperObjects() {
  return fetch('/cooper-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: COOPER_QUERY }),
  })
    .then(r => r.json())
    .then(d => (d.data || {}).object || [])
}

export default function useCooperData() {
  const [textures, setTextures] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [artworkMetas, setArtworkMetas] = useState([])
  const swapCancelled = useRef(false)
  const ready = textures.length >= COUNT

  useEffect(() => {
    fetchCooperObjects().then((items) => {
      const valid = items.filter((item) => {
        const media = item.multimedia || []
        return media.length > 0 && media[0].preview && media[0].preview.url && media[0].cc0 === true
      })
      if (valid.length >= COUNT) {
        const selected = valid.slice(0, COUNT)
        setImageUrls(selected.map((item) => proxyImg(item.multimedia[0].preview.url)))
        setArtworkMetas(selected.map((item) => ({
          title: (item.summary && item.summary.title) || 'Untitled',
          artist: (item.agent && item.agent[0] && item.agent[0].summary && item.agent[0].summary.title) || 'Unknown Designer',
          year: (item.date && item.date[0] && item.date[0].value) || 'Unknown Year',
        })))
        Promise.all(
          selected.map((item) => preloadTexture(item.multimedia[0].preview.url))
        ).then(setTextures)
      }
    })
  }, [])

  useEffect(() => {
    if (textures.length < COUNT) return
    swapCancelled.current = false

    const swapLoop = async () => {
      while (!swapCancelled.current) {
        const idx = Math.floor(Math.random() * COUNT)
        try {
          const items = await fetchCooperObjects()
          const item = items.find((i) => {
            const media = i.multimedia || []
            return media.length > 0 && media[0].preview && media[0].preview.url && media[0].cc0 === true
          })
            if (item && !swapCancelled.current) {
            const url = proxyImg(item.multimedia[0].preview.url)
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
                  title: (item.summary && item.summary.title) || 'Untitled',
                  artist: (item.agent && item.agent[0] && item.agent[0].summary && item.agent[0].summary.title) || 'Unknown Designer',
                  year: (item.date && item.date[0] && item.date[0].value) || 'Unknown Year',
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
    count: COUNT,
    getImageUrl: (i) => imageUrls[i] || null,
    getMeta: (i) => artworkMetas[i] || null,
  }
}
