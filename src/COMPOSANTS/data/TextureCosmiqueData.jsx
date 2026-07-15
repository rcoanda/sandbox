import { useState, useEffect } from 'react'
import { COUNT, generateCosmicTexture } from '../trajectoires/EllipseScene'

export default function useTextureCosmiqueData() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    Promise.resolve().then(() => {
      const tex = Array.from({ length: COUNT }, () => generateCosmicTexture())
      setTextures(tex)
      setImageUrls(tex.map((t) => t.image.toDataURL()))
      setReady(true)
    })
  }, [])

  return {
    ready,
    textures,
    count: COUNT,
    getImageUrl: (i) => imageUrls[i] || null,
    getMeta: () => ({ title: 'Texture cosmique', artist: 'Générée local' }),
  }
}
