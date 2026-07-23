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
      const meta = items
        .map((item) => {
          const url = extractUrl(item)
          if (!url) return null
          return {
            url,
            title: Array.isArray(item.title) ? item.title[0] : (item.title || ''),
            artist: Array.isArray(item.dataProvider) ? item.dataProvider[0] : (item.dataProvider || ''),
            date: Array.isArray(item.year) ? item.year[0] : '',
            place: Array.isArray(item.country) ? item.country[0] : '',
          }
        })
        .filter(Boolean)
      const urls = meta.map((m) => m.url)
      if (urls.length < 10) return { urls: [], meta: [] }
      return { urls, meta }
    },
    getMetaFn: (meta) => meta ? { title: meta.title, artist: meta.artist, date: meta.date, place: meta.place } : null,
  })
}
