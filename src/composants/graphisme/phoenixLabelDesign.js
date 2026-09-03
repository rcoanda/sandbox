import { useEffect, useState } from 'react'
import usePageDico from '../Dico'

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
export const PHOENIX_VIEWBOX = '0 0 420 580'
export const PHOENIX_WIDTH = 420
export const PHOENIX_HEIGHT = 580
const PHOENIX_BRAND = 'NOM PARFUM'
const PHOENIX_KIND = 'TYPE PARFUM'
const PHOENIX_DETAILS = 'Details Parfum'
export const PHOENIX_BRAND_FONT = '"Italianno", cursive'

export const PHOENIX_COLORS = {
  bg: '#f6ecd9',
  gold: '#c9a44a',
  brown: '#8a6d3b',
  dark: '#3a2e20',
  ink: '#1f1a12',
  flameFrom: '#c1440e',
  flameTo: '#e07a3f',
  haloCenter: '#fdf8ea',
  haloMid: '#f2dc9b',
}

const PHOENIX_FRAME = {
  outer: { x: 45, y: 45, w: 330, h: 490, rx: 40 },
  inner: { x: 55, y: 55, w: 310, h: 470, rx: 32, strokeWidth: 7 },
}

// helpers SVG
export function frameOuterSvg() {
  const { x, y, w, h, rx } = PHOENIX_FRAME.outer
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${PHOENIX_COLORS.bg}" />`
}

export function frameInnerSvg() {
  const { x, y, w, h, rx, strokeWidth } = PHOENIX_FRAME.inner
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="${PHOENIX_COLORS.gold}" stroke-width="${strokeWidth}" />`
}

export function usePhoenixLabelDesign() {
  const dico = usePageDico('phoenix')
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
