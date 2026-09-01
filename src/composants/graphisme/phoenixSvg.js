export const PHOENIX_LABEL_VIEWBOX = '0 0 420 580'

export const PHOENIX_LABEL_INNER = `
  <defs>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4e3ad" />
      <stop offset="0.5" stop-color="#c9a44a" />
      <stop offset="1" stop-color="#8a6d3b" />
    </linearGradient>
    <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#c1440e" />
      <stop offset="1" stop-color="#e07a3f" />
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.42" r="0.62">
      <stop offset="0" stop-color="#fdf8ea" stop-opacity="0.9" />
      <stop offset="0.7" stop-color="#f2dc9b" stop-opacity="0.35" />
      <stop offset="1" stop-color="#c9a44a" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect x="30" y="30" width="360" height="520" rx="28" fill="#f6ecd9" stroke="#c9a44a" stroke-width="6" />
  <rect x="48" y="48" width="324" height="484" rx="20" fill="none" stroke="#c9a44a" stroke-width="1.5" />
  <rect x="54" y="54" width="312" height="472" rx="16" fill="none" stroke="#c9a44a" stroke-width="0.75" opacity="0.6" />

  <text x="210" y="100" text-anchor="middle" font-family="serif" font-style="italic" font-size="16" fill="#8a6d3b">— · —</text>
  <text x="210" y="132" text-anchor="middle" font-family="Georgia, serif" font-size="17" letter-spacing="6" fill="#3a2e20">EAU DE PARFUM</text>
  <line x1="120" y1="212" x2="300" y2="212" stroke="#c9a44a" stroke-width="1.5" />
  <circle cx="210" cy="212" r="2.5" fill="#c9a44a" />

  <circle cx="210" cy="290" r="118" fill="url(#halo)" />
  <circle cx="210" cy="290" r="118" fill="none" stroke="#c9a44a" stroke-width="1" opacity="0.55" />

  <g transform="translate(210 290)">
    <g fill="url(#goldGrad)" stroke="#8a6d3b" stroke-width="1.2" stroke-linejoin="round">
      <path d="M 6 -2 C 40 -34 74 -50 112 -50 C 90 -34 62 -22 32 -10 Z" />
      <path d="M 4 4 C 46 -22 86 -34 124 -28 C 98 -16 66 -4 34 6 Z" />
      <path d="M 4 12 C 42 -8 82 -20 120 -12 C 92 2 60 10 30 14 Z" />
      <path d="M 4 20 C 38 2 72 -6 108 4 C 82 12 54 18 28 20 Z" />
      <path d="M 3 28 C 40 12 68 8 98 16 C 74 24 46 26 24 28 Z" />
    </g>
    <g transform="scale(-1 1)" fill="url(#goldGrad)" stroke="#8a6d3b" stroke-width="1.2" stroke-linejoin="round">
      <path d="M 6 -2 C 40 -34 74 -50 112 -50 C 90 -34 62 -22 32 -10 Z" />
      <path d="M 4 4 C 46 -22 86 -34 124 -28 C 98 -16 66 -4 34 6 Z" />
      <path d="M 4 12 C 42 -8 82 -20 120 -12 C 92 2 60 10 30 14 Z" />
      <path d="M 4 20 C 38 2 72 -6 108 4 C 82 12 54 18 28 20 Z" />
      <path d="M 3 28 C 40 12 68 8 98 16 C 74 24 46 26 24 28 Z" />
    </g>

    <path d="M 0 -46 C -8 14 -8 60 -2 92 C 4 60 4 14 0 -46 Z" fill="#1f1a12" />
    <path d="M 0 -34 C -2 16 -2 52 0 76 C -10 50 -12 6 0 -34 Z" fill="#3a2e20" opacity="0.7" />

    <path d="M -2 88 C -10 120 -12 142 -6 160 C -2 138 -2 112 0 88 Z" fill="url(#goldGrad)" stroke="#8a6d3b" stroke-width="1" />
    <path d="M 2 88 C 10 120 12 142 6 160 C 2 138 2 112 0 88 Z" fill="url(#goldGrad)" stroke="#8a6d3b" stroke-width="1" />
    <path d="M 0 90 C -4 116 -2 140 2 166 C 2 138 2 112 0 90 Z" fill="#3a2e20" />

    <circle cx="0" cy="-58" r="10" fill="url(#goldGrad)" stroke="#8a6d3b" stroke-width="1" />
    <path d="M 7 -62 L 16 -66 L 9 -56 Z" fill="#3a2e20" />

    <path d="M 0 -70 C -2 -82 -5 -88 -10 -92 C -5 -90 -3 -86 0 -86 C 3 -90 6 -94 10 -96 C 5 -90 3 -84 0 -70 Z" fill="url(#flameGrad)" />
    <path d="M -4 -60 C -7 -68 -10 -72 -14 -74 C -9 -72 -7 -68 -5 -60 Z" fill="url(#flameGrad)" opacity="0.85" />

    <path d="M -7 176 C -12 168 -10 158 -4 152 C 4 158 14 162 8 174 C 2 170 -4 176 -7 176 Z" fill="url(#flameGrad)" />
    <path d="M -12 150 C -18 142 -16 130 -10 124 C -2 130 8 136 2 148 C -4 142 -10 148 -12 150 Z" fill="url(#flameGrad)" opacity="0.9" />
    <path d="M 6 158 C 10 148 12 138 9 130 C 5 138 3 146 6 158 Z" fill="url(#flameGrad)" opacity="0.8" />
  </g>

  <text x="210" y="506" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="15" letter-spacing="3" fill="#8a6d3b">PARIS · 50 ML</text>
  <text x="210" y="536" text-anchor="middle" font-family="serif" font-style="italic" font-size="14" fill="#8a6d3b">— · —</text>
`

export function phoenixLabelSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="580" viewBox="${PHOENIX_LABEL_VIEWBOX}">${PHOENIX_LABEL_INNER}</svg>`
}