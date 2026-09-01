import { useEffect, useRef } from 'react'
import '../../styles/geometrie/Polygone.css'

const P = [200, 90]
const A3 = [300, 330]
const B3 = [100, 330]
const A4 = [310, 230]
const C4 = [200, 350]
const B4 = [90, 230]
const A5 = [290, 175]
const BR5 = [285, 335]
const BL5 = [115, 335]
const B5 = [110, 175]
const A6 = [285, 170]
const DR6 = [285, 260]
const D6 = [200, 345]
const DL6 = [115, 260]
const B6 = [115, 170]

const SHAPES = [
  [P, A3, A3, A3, B3, B3],
  [P, A4, C4, C4, B4, B4],
  [P, A5, BR5, BR5, BL5, B5],
  [P, A6, DR6, D6, DL6, B6],
]

const INIT_DELAY = 1.5
const MORPH_TIME = 3

const EASE = (t) => t * t * (3 - 2 * t)

function pointsString(pts) {
  return pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
}

function PolygoneScene() {
  const polygonRef = useRef(null)

  useEffect(() => {
    let raf
    const start = performance.now()
    const morphTotal = (SHAPES.length - 1) * MORPH_TIME

    const tick = (now) => {
      const t = (now - start) / 1000
      const cycle = Math.max(0, t - INIT_DELAY) % morphTotal
      let pts = SHAPES[0]
      if (t >= INIT_DELAY) {
        const stage = Math.floor(cycle / MORPH_TIME)
        const frac = EASE((cycle - stage * MORPH_TIME) / MORPH_TIME)
        const from = SHAPES[stage]
        const to = SHAPES[stage + 1]
        pts = from.map((p, i) => [
          p[0] + (to[i][0] - p[0]) * frac,
          p[1] + (to[i][1] - p[1]) * frac,
        ])
      }
      if (polygonRef.current) {
        polygonRef.current.setAttribute('points', pointsString(pts))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="polygone-layout">
      <svg viewBox="0 0 400 400" className="polygone-svg">
        <polygon
          ref={polygonRef}
          points={pointsString(SHAPES[0])}
          fill="none"
          stroke="#00aaff"
          strokeWidth="10"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default PolygoneScene