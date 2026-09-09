import { phoenixRectoInner, PhoenixSVGRecto } from './phoenixSVG.js'
import { usePhoenixLabelDesign } from './phoenixLabelDesign.js'

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

function rectoInput(design) {
  return {
    brand: design.brand,
    kind: design.kind,
    details: design.details,
    brandFont: design.brandFont,
    fontFace: design.fontFace,
    brandSize: getBrandFontSize(design.brand, design.brandFont),
  }
}

export function usePhoenixRectoInner() {
  return phoenixRectoInner(rectoInput(usePhoenixLabelDesign()))
}

export function usePhoenixRectoSvg() {
  return PhoenixSVGRecto(rectoInput(usePhoenixLabelDesign()))
}