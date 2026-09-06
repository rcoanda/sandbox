import { reelCode } from '../../config/PortfoliosConfig'

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