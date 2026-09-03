import {
  PHOENIX_VIEWBOX,
  PHOENIX_WIDTH,
  PHOENIX_HEIGHT,
  PHOENIX_COLORS,
  frameOuterSvg,
  frameInnerSvg,
  usePhoenixLabelDesign,
} from './phoenixLabelDesign.js'

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getBrandFontSize(brand, brandFont, baseSize = 84, maxWidth = 250) {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return baseSize
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return baseSize
    let size = baseSize
    while (size > 10) {
      ctx.font = `400 ${size}px ${brandFont}`
      if (ctx.measureText(brand).width <= maxWidth) break
      size -= 2
    }
    return size
  } catch {
    return baseSize
  }
}

export function usePhoenixRectoInner() {
  const { brand, kind, details, brandFont, fontFace } = usePhoenixLabelDesign()
  const b = escapeXml(brand)
  const k = escapeXml(kind)
  const d = escapeXml(details)
  const bf = escapeXml(brandFont)
  const brandSize = getBrandFontSize(brand, brandFont)

  return `
  ${fontFace}
  ${frameOuterSvg()}
  ${frameInnerSvg()}
  <text x="210" y="132" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" fill="${PHOENIX_COLORS.brown}">— · —</text>
  <text x="210" y="172" text-anchor="middle" font-family="Georgia, serif" font-weight="600" font-size="28" fill="${PHOENIX_COLORS.dark}">${k}</text>
  <text x="210" y="330" text-anchor="middle" font-family="${bf}" font-style="italic"  font-size="${brandSize}" fill="${PHOENIX_COLORS.ink}">${b}</text>
  <line x1="95" y1="425" x2="325" y2="425" stroke="${PHOENIX_COLORS.gold}" stroke-width="2" />
  <text x="210" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="24" fill="${PHOENIX_COLORS.brown}">${d}</text>
 `
}

export function usePhoenixRectoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOENIX_WIDTH}" height="${PHOENIX_HEIGHT}" viewBox="${PHOENIX_VIEWBOX}">${usePhoenixRectoInner()}</svg>`
}
