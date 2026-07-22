import useTextureLoader from './TextureLoader'

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

function extractUrl(item) {
  const preview = Array.isArray(item.edmPreview) ? item.edmPreview[0] : item.edmPreview
  const shownBy = Array.isArray(item.edmIsShownBy) ? item.edmIsShownBy[0] : item.edmIsShownBy
  const obj = Array.isArray(item.edmObject) ? item.edmObject[0] : item.edmObject
  return preview || shownBy || obj
}

export default function useEuropeData() {
  return useTextureLoader({
    cacheKey: 'europe',
    count: COUNT,
    loadFn: async () => {
      const res = await fetch(`https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=*:*&media=true&thumbnail=true&rows=${COUNT}`)
      const data = await res.json()
      const items = (data.items || []).filter((item) => isPermissive(item.rights))
      const urls = items.map(extractUrl).filter(Boolean)
      if (urls.length < 10) return { urls: [], meta: [] }
      return { urls, meta: urls.map((url) => ({ url })) }
    },
    getMetaFn: () => ({ title: 'Europeana', artist: 'Cultural Heritage' }),
  })
}
