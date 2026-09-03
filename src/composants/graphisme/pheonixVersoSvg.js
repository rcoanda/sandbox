import {
  PHOENIX_VIEWBOX,
  PHOENIX_COLORS,
  frameOuterSvg,
  frameInnerSvg,
} from './phoenixLabelDesign.js'




export const PHOENIX_VERSO_INNER = `
  ${frameOuterSvg()}
  ${frameInnerSvg()}

  <text x="210" y="132" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" fill="${PHOENIX_COLORS.brown}">— · —</text>
  <text x="210" y="172" text-anchor="middle" font-family="Georgia, serif" font-weight="600" font-size="28" fill="${PHOENIX_COLORS.dark}">EAU DE PARFUM</text>


  <g transform="translate(210 290)" fill="${PHOENIX_COLORS.gold}">
    <circle cx="0" cy="0" r="110" fill="none" stroke="${PHOENIX_COLORS.gold}" stroke-width="1" opacity="0.35" />

    <path d="M -18 30 C -30 -8 -14 -44 22 -42 C 50 -34 46 0 28 22 C 10 32 -8 36 -18 30 Z" />
    <path d="M 22 -42 C 30 -54 44 -60 52 -52 C 58 -44 52 -34 34 -30 Z" />
    <path d="M 50 -56 L 70 -54 L 52 -44 Z" />
    <path d="M 40 -50 L 54 -42" stroke="${PHOENIX_COLORS.gold}" stroke-width="4" stroke-linecap="round" />
    <path d="M 4 -4 L 98 -58 L 108 -24 L 30 10 Z" />
    <path d="M 8 8 L 80 -34 L 86 -12 L 24 22 Z" />
    <path d="M 18 -12 L 88 -50" stroke="${PHOENIX_COLORS.gold}" stroke-width="3" stroke-linecap="round" />
    <path d="M 22 2 L 70 -30" stroke="${PHOENIX_COLORS.gold}" stroke-width="3" stroke-linecap="round" />
    <path d="M -12 24 L -34 60 L -24 28 Z" />
    <path d="M -4 30 L -22 72 L -8 34 Z" />
  </g>

  <line x1="95" y1="425" x2="325" y2="425" stroke="${PHOENIX_COLORS.gold}" stroke-width="2" />
  <text x="210" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="24" fill="${PHOENIX_COLORS.brown}">Paris · 50 ml</text>

`


export function phoenixVersoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="580" viewBox="${PHOENIX_VIEWBOX}">${PHOENIX_VERSO_INNER}</svg>`
}

