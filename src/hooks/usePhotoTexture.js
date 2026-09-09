// Hook qui charge la texture d'une photo à la position `index` dans la liste
// fournie par photoService (URLs Cloudinary construites depuis people.json).
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { getPeopleUrls } from '../services/galeriesApi/photoService'

const loader = new THREE.TextureLoader()
const MAX_SIZE = 512

function resizeToCanvas(img, maxSize) {
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
  const w = Math.max(1, Math.floor(img.width * scale))
  const h = Math.max(1, Math.floor(img.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, 0, w, h)
  return canvas
}

export function usePhotoTexture(index, source) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    let cancelled = false
    let texture = null
    const dispose = () => { if (texture) { texture.dispose(); texture = null } }

    getPeopleUrls(source).then((urls) => {
      if (cancelled) return
      loader.load(
        urls[index % urls.length],
        (t) => {
          if (cancelled) { t.dispose(); return }
          texture = new THREE.CanvasTexture(resizeToCanvas(t.image, MAX_SIZE))
          texture.colorSpace = THREE.SRGBColorSpace
          t.dispose()
          setTexture(texture)
        },
        undefined,
        (e) => console.error('Échec du chargement de la texture :', urls[index % urls.length], e)
      )
    })

    return () => { cancelled = true; dispose() }
  }, [index, source])

  return texture
}