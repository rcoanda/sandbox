// Hook qui charge la texture d'une photo à la position `index` dans la liste
// fournie par photoService (URLs Cloudinary construites depuis people.json).
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { getPeopleUrls } from '../services/galeriesApi/photoService'

export function usePhotoTexture(index, source) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    let cancelled = false
    getPeopleUrls(source).then((urls) => {
      if (cancelled) return
      new THREE.TextureLoader().load(
        urls[index % urls.length],
        (t) => {
          if (cancelled) return
          t.colorSpace = THREE.SRGBColorSpace
          setTexture(t)
        },
        undefined,
        (e) => console.error('Échec du chargement de la texture :', urls[index % urls.length], e)
      )
    })
    return () => { cancelled = true }
  }, [index, source])

  return texture
}