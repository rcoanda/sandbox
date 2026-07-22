import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const ROBOFLOW_WORKSPACE = 'LhZe9xSpLbPGwPNJW8WEjUbVnE42'
const IMAGE_IDS = [
  '02dvzlug0lsJGDaxGUqD',
  '033btQqnrZTwL5D0NP2U',
  '03pD0wWWNhEWrcQyjC7n',
  '066JFtah5gKGJMdkrcrP',
  '07AC8JYpyzLojDqulBFc',
  '081bL1irbNI5QXkg9EBG',
  '0901LJmYlO2UVfXRoaMh',
]
const COUNT = IMAGE_IDS.length
const IMAGE_URLS = IMAGE_IDS.map(
  (id) => `/roboflow-img/${ROBOFLOW_WORKSPACE}/${id}/thumb.jpg`,
)

export default function useAquatiqueData() {
  const [ready, setReady] = useState(false)
  const [texturePool, setTexturePool] = useState([])
  const loaderRef = useRef(new THREE.TextureLoader())

  useEffect(() => {
    const loaded = []
    IMAGE_URLS.forEach((url) => {
      loaderRef.current.load(url, (tex) => {
        loaded.push({ texture: tex, url })
        if (loaded.length === IMAGE_URLS.length) {
          setTexturePool([...loaded])
          setReady(true)
        }
      })
    })
    return () => {
      loaded.forEach((e) => e.texture.dispose())
    }
  }, [])

  return {
    ready,        // Booléen — vrai quand toutes les textures sont chargées
    texturePool,  // Tableau de { texture: THREE.Texture, url: string }
    textures: texturePool.map((e) => e.texture), // Tableau de THREE.Texture
    loadingError: null,       // null ici (URLs statiques, pas de fetch)
    getImageUrl: (i) => IMAGE_URLS[i] || null, // (i) => string | null
    getMeta: (i) => ({
      title: `Aquatique #${i + 1}`,
      artist: IMAGE_IDS[i] || '',
    }), // (i) => { title, artist }
  }
}
