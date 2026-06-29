import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import './Animation.css'

const ROWS = 8
const COLS = 14

function Animation() {
  const gridRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const posRef = useRef([])

  const [rects] = useState(() =>
    Array.from({ length: ROWS * COLS }, () => ({
      hue: Math.random() * 360,
    }))
  )

  useEffect(() => {
    const els = gridRef.current.querySelectorAll('.rect')
    const n = els.length
    const setX = []
    const setY = []
    const setRot = []
    const target = []
    const current = []

    for (let i = 0; i < n; i++) {
      setX[i] = gsap.quickSetter(els[i], 'x', 'px')
      setY[i] = gsap.quickSetter(els[i], 'y', 'px')
      setRot[i] = gsap.quickSetter(els[i], 'rotation', 'deg')
      target[i] = { x: 0, y: 0, rot: 0 }
      current[i] = { x: 0, y: 0, rot: 0 }
    }

    const compute = () => {
      els.forEach((el, i) => {
        const b = el.getBoundingClientRect()
        posRef.current[i] = {
          cx: b.left + b.width / 2,
          cy: b.top + b.height / 2,
        }
      })
    }

    compute()

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const { x: mx, y: my } = mouseRef.current
      for (let i = 0; i < n; i++) {
        const p = posRef.current[i]
        if (!p) continue

        const dx = mx - p.cx
        const dy = my - p.cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const strength = Math.max(0, 1 - dist / 600)

        target[i].x = dx * 0.04
        target[i].y = dy * 0.04
        target[i].rot = dx * 0.015 * strength

        current[i].x += (target[i].x - current[i].x) * 0.08
        current[i].y += (target[i].y - current[i].y) * 0.08
        current[i].rot += (target[i].rot - current[i].rot) * 0.08

        setX[i](current[i].x)
        setY[i](current[i].y)
        setRot[i](current[i].rot)
      }
    }

    const onResize = () => { compute() }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div className="animation-page">
      <div className="animation-grid" ref={gridRef} style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {rects.map((r, i) => (
          <div
            key={i}
            className="rect"
            style={{ backgroundColor: `hsl(${r.hue}, 70%, 60%)` }}
          />
        ))}
      </div>
    </div>
  )
}

export default Animation
