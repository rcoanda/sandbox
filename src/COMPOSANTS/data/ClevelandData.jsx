import useTextureLoader from './TextureLoader'

const COUNT = 60

export default function useClevelandData() {
  return useTextureLoader({
    cacheKey: 'cleveland',
    count: COUNT,
    loadFn: async () => {
      const res = await fetch(`https://openaccess-api.clevelandart.org/api/artworks?has_image=1&limit=${COUNT}`)
      const data = await res.json()
      const items = data.data || []

      const metas = items.map((item) => {
        const web = item.images?.web?.url
        const print = item.images?.print?.url
        const original = web || print
        return {
          url: original ? original.replace('https://openaccess-cdn.clevelandart.org', '/cma') : null,
          title: item.title || 'Untitled',
          artist: item.creators?.[0]?.description || 'Unknown Artist',
          year: item.creation_date || 'Unknown Year',
        }
      })

      const filtered = metas.filter((m) => m.url)
      const urls = filtered.map((m) => m.url)

      if (urls.length < 10) return { urls: [], meta: [] }
      return { urls, meta: filtered }
    },
    getMetaFn: (meta) => meta || null,
  })
}
