// Hook qui charge la texture d'une photo à la position `index` dans la liste
// fournie par photoService (URLs Cloudinary construites depuis people.json).
// Le canvas réduit/orienté est mis en cache au niveau du module : le réseau et
// le décodage n'ont lieu qu'une seule fois, au premier passage sur la page.
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { getPeopleUrls } from '../services/galeriesApi/photoService'

const loader = new THREE.TextureLoader()
const MAX_SIZE = 512

const canvasCache = new Map()
const pendingLoads = new Map()

function resizeToCanvas(img) {
  const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height))
  const w = Math.max(1, Math.floor(img.height * scale))
  const h = Math.max(1, Math.floor(img.width * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.translate(w, 0)
  ctx.rotate(Math.PI / 2)
  ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale)
  return canvas
}

function loadCanvas(url) {
  const cached = canvasCache.get(url)
  if (cached) return Promise.resolve(cached)
  if (!pendingLoads.has(url)) {
    pendingLoads.set(
      url,
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (t) => {
            const canvas = resizeToCanvas(t.image)
            t.dispose()
            canvasCache.set(url, canvas)
            pendingLoads.delete(url)
            resolve(canvas)
          },
          undefined,
          (e) => {
            pendingLoads.delete(url)
            console.error('Échec du chargement de la texture :', url, e)
            reject(e)
          }
        )
      })
    )
  }
  return pendingLoads.get(url)
}

export function usePhotoTexture(index, source) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    let cancelled = false
    let texture = null
    const dispose = () => { if (texture) { texture.dispose(); texture = null } }

    getPeopleUrls(source).then((urls) => {
      const url = urls[index % urls.length]
      loadCanvas(url).then((canvas) => {
        if (cancelled) return
        texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        setTexture(texture)
      })
    })

    return () => { cancelled = true; dispose() }
  }, [index, source])

  return texture
}