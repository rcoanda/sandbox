// Exporte les deux étiquettes Phoenix (recto = marque, verso = phénix) en JPEG
// dans public/assets/graphisme. Pipeline : SVG partagé (phoenixSvg.js) → page
// HTML → capture Chrome headless (PNG @2x) → conversion JPEG (sips).
import { readFileSync, writeFileSync, unlinkSync, mkdtempSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import { join, dirname } from 'path'
import { tmpdir } from 'os'
import { fileURLToPath } from 'url'
import { phoenixRectoSvg, phoenixVersoSvg, PHOENIX_BRAND_FONT } from '../src/composants/graphisme/phoenixSvg.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'public', 'assets', 'graphisme')
const SCALE = 2
const W = 420 * SCALE
const H = 580 * SCALE
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

function readLang() {
  return JSON.parse(readFileSync(join(ROOT, 'public', 'lang', 'fr', 'pages', 'graphisme', 'phoenix.json'), 'utf8'))
}

function fontFaceDataUrl() {
  const buf = readFileSync(join(ROOT, 'public', 'font', 'graphisme', 'Italianno.woff2'))
  return `data:font/woff2;base64,${buf.toString('base64')}`
}

function htmlFor(svg) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>html,body{margin:0;padding:0;background:#f6ecd9}svg{width:${W}px;height:${H}px;display:block}</style>
</head><body>${svg}</body></html>`
}

function screenshot(html, outPng) {
  const dir = mkdtempSync(join(tmpdir(), 'phoenix-'))
  const file = join(dir, 'label.html')
  writeFileSync(file, html)
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${W},${H}`,
    '--virtual-time-budget=3000',
    `--screenshot=${outPng}`,
    `file://${file}`,
  ], { stdio: 'ignore' })
  rmSync(dir, { recursive: true, force: true })
}

function toJpeg(png, jpg) {
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90', png, '--out', jpg], { stdio: 'ignore' })
  unlinkSync(png)
}

const dico = readLang()
const fontFace = `<style>@font-face{font-family:'Italianno';src:url(${fontFaceDataUrl()}) format('woff2');}</style>`

const rectoSvg = phoenixRectoSvg({
  brand: dico.marque,
  kind: dico.type,
  details: dico.details,
  brandFont: PHOENIX_BRAND_FONT,
  fontFace,
})
const versoSvg = phoenixVersoSvg()

const jobs = [
  { name: 'phoenix-recto', svg: rectoSvg },
  { name: 'phoenix-verso', svg: versoSvg },
]

for (const job of jobs) {
  const png = join(OUT_DIR, `${job.name}.png`)
  const jpg = join(OUT_DIR, `${job.name}.jpg`)
  screenshot(htmlFor(job.svg), png)
  toJpeg(png, jpg)
  console.log(`✓ ${jpgsuffix(jpg)}`)
}

function jpgsuffix(p) { return p.replace(ROOT + '/', '') }