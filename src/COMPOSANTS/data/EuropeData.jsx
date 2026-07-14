import { useState, useEffect } from 'react'
import * as THREE from 'three'

const COUNT = 60

const PERMISSIVE = [
  'creativecommons.org/publicdomain',
  'creativecommons.org/licenses/zero',
  'creativecommons.org/licenses/by/',
  'creativecommons.org/licenses/by-sa/',
]

function isPermissive(rights) {
  if (!rights) return false
  const url = Array.isArray(rights) ? rights[0] : rights
  return PERMISSIVE.some((p) => url.includes(p))
}

export default function useEuropeData() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    const loader = new THREE.TextureLoader()

    fetch('https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=*:*&media=true&thumbnail=true&rows=60')
      .then((res) => res.json())
      .then((data) => {
        const items = (data.items || []).filter((item) => isPermissive(item.rights))
        const urls = items
          .map((item) => {
            const preview = Array.isArray(item.edmPreview) ? item.edmPreview[0] : item.edmPreview
            const shownBy = Array.isArray(item.edmIsShownBy) ? item.edmIsShownBy[0] : item.edmIsShownBy
            const obj = Array.isArray(item.edmObject) ? item.edmObject[0] : item.edmObject
            return preview || shownBy || obj
          })
          .filter(Boolean)

        if (urls.length < 10) return

        setImageUrls(urls)

        let loaded = 0
        const tex = []
        const onLoad = () => {
          loaded++
          if (loaded >= urls.length) {
            setTextures(tex)
            setReady(true)
          }
        }

        urls.forEach((url, i) => {
          loader.load(
            url,
            (t) => { tex[i] = t; onLoad() },
            undefined,
            () => onLoad()
          )
        })
      })
      .catch(() => {})
  }, [])

  return {
    ready,
    textures,
    count: COUNT,
    getImageUrl: (i) => imageUrls[i] || null,
    getMeta: () => ({ title: 'Europeana', artist: 'Cultural Heritage' }),
  }
}
