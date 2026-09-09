import { useEffect, useState } from 'react'
import usePageDico from '../globals/Dico'
import { PHOENIX_VIEWBOX, PHOENIX_WIDTH, PHOENIX_HEIGHT, PHOENIX_BRAND_FONT, PHOENIX_COLORS, frameOuterSvg, frameInnerSvg } from './phoenixSVG.js'

export { PHOENIX_VIEWBOX, PHOENIX_WIDTH, PHOENIX_HEIGHT, PHOENIX_BRAND_FONT, PHOENIX_COLORS, frameOuterSvg, frameInnerSvg }

let cachedFontFace = ''

async function loadBrandFontFace() {
  if (cachedFontFace) return cachedFontFace
  try {
    const url = `${import.meta.env.BASE_URL}font/graphisme/Italianno.woff2`
    const res = await fetch(url)
    const blob = await res.blob()
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    cachedFontFace = `<style>@font-face{font-family:'Italianno';src:url(${dataUrl}) format('woff2');}</style>`
  } catch {
    cachedFontFace = ''
  }
  return cachedFontFace
}

// Design system partagé Recto / Verso — single source of truth
const PHOENIX_BRAND = 'NOM PARFUM'
const PHOENIX_KIND = 'TYPE PARFUM'
const PHOENIX_DETAILS = 'Details Parfum'

// helpers SVG
export function usePhoenixLabelDesign() {
  const dico = usePageDico('phoenixsvg')
  const [fontFace, setFontFace] = useState(cachedFontFace)

  useEffect(() => {
    let cancelled = false
    loadBrandFontFace().then((ff) => {
      if (!cancelled) setFontFace(ff)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    brand: dico?.marque ?? PHOENIX_BRAND,
    kind: dico?.type ?? PHOENIX_KIND,
    details: dico?.details ?? PHOENIX_DETAILS,
    brandFont: PHOENIX_BRAND_FONT,
    fontFace: fontFace,
  }
}
