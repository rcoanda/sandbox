import { useState, useEffect } from 'react'

export const LANG = {
  fr: {
    film: 'KODAK',
    frame: 'VUE',
    badge: '35MM',
    play: 'PROJETER CE SITE',
  },
  en: {
    film: 'KODAK',
    frame: 'FRAME',
    badge: '35MM',
    play: 'PROJECT THIS SITE',
  },
}

const pad = (n) => String(n).padStart(4, '0')

export function reelCode(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h.toString(36).padStart(4, '0').slice(0, 4)
}

/* Vérifie si un fichier statique est réellement servi.
   Le serveur renvoie index.html (text/html) pour tout chemin inconnu,
   donc on vérifie le Content-Type : un asset réel a un type non-HTML. */
export async function assetUrlAvailable(url) {
  if (!url) return false
  try {
    const res = await fetch(url, { method: 'HEAD' })
    if (!res.ok) return false
    const ctype = (res.headers.get('content-type') || '').split(';')[0].toLowerCase()
    return ctype !== '' && ctype !== 'text/html'
  } catch {
    return false
  }
}

let portfoliosCache = null

async function loadPortfolios() {
  if (portfoliosCache) return portfoliosCache
  const res = await fetch(`${import.meta.env.BASE_URL}assets/portfolios/portfolios.json`)
  const data = await res.json()
  portfoliosCache = data
  return data
}

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState(null)

  useEffect(() => {
    let alive = true
    loadPortfolios()
      .then((data) => {
        if (alive) setPortfolios(data)
      })
      .catch(() => {
        if (alive) setPortfolios([])
      })
    return () => {
      alive = false
    }
  }, [])

  return portfolios
}

export function frameText(site, index, total, lang) {
  const t = LANG[lang] || LANG.fr
  const code = reelCode(site.name)
  return {
    headLeft: `${t.film} — ${t.frame} ${pad(index + 1)}`,
    headRight: `${t.badge} ${code}`,
    reel: `#${code}-${pad(index)}/${total}`,
    edge: `${site.name.toUpperCase()} — ${t.badge} — ${index + 1}/${total}`,
    screenUrl: site.url.replace(/^https?:\/\//, ''),
    play: t.play,
  }
}