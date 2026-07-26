import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const ROWS = 8
const COLS = 14
const TOTAL = ROWS * COLS

function MetropolitanLayout({ artworks, ready, expandedIndex, onImageClick }) {
  const gridRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const posRef = useRef([])
  const parallaxActive = useRef([])
  const setXRef = useRef([])
  const setYRef = useRef([])
  const setRotRef = useRef([])
  const targetRef = useRef([])
  const currentRef = useRef([])
  const prevExpandedRef = useRef(null)

  useEffect(() => {
    parallaxActive.current = new Array(TOTAL).fill(true)

    const els = gridRef.current.querySelectorAll('.rect')
    const n = els.length

    for (let i = 0; i < n; i++) {
      setXRef.current[i] = gsap.quickSetter(els[i], 'x', 'px')
      setYRef.current[i] = gsap.quickSetter(els[i], 'y', 'px')
      setRotRef.current[i] = gsap.quickSetter(els[i], 'rotation', 'deg')
      targetRef.current[i] = { x: 0, y: 0, rot: 0 }
      currentRef.current[i] = { x: 0, y: 0, rot: 0 }
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
        if (!parallaxActive.current[i]) continue
        const p = posRef.current[i]
        if (!p) continue

        const dx = mx - p.cx
        const dy = my - p.cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const strength = Math.max(0, 1 - dist / 600)

        targetRef.current[i].x = dx * 0.04
        targetRef.current[i].y = dy * 0.04
        targetRef.current[i].rot = dx * 0.015 * strength

        currentRef.current[i].x += (targetRef.current[i].x - currentRef.current[i].x) * 0.08
        currentRef.current[i].y += (targetRef.current[i].y - currentRef.current[i].y) * 0.08
        currentRef.current[i].rot += (targetRef.current[i].rot - currentRef.current[i].rot) * 0.08

        setXRef.current[i](currentRef.current[i].x)
        setYRef.current[i](currentRef.current[i].y)
        setRotRef.current[i](currentRef.current[i].rot)
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

  useEffect(() => {
    if (prevExpandedRef.current !== null && expandedIndex === null) {
      const index = prevExpandedRef.current
      targetRef.current[index] = { x: 0, y: 0, rot: 0 }
      currentRef.current[index] = { x: 0, y: 0, rot: 0 }
      parallaxActive.current[index] = true
    }
    if (expandedIndex !== null) {
      parallaxActive.current[expandedIndex] = false
      targetRef.current[expandedIndex] = { x: 0, y: 0, rot: 0 }
      currentRef.current[expandedIndex] = { x: 0, y: 0, rot: 0 }
      if (setXRef.current[expandedIndex]) {
        setXRef.current[expandedIndex](0)
        setYRef.current[expandedIndex](0)
        setRotRef.current[expandedIndex](0)
      }
    }
    prevExpandedRef.current = expandedIndex
  }, [expandedIndex])

  return (
    <div className="metropolitan-layout" ref={gridRef} style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
      {Array.from({ length: TOTAL }, (_, i) => {
        const art = artworks[i]
        return (
          <div
            key={i}
            className={`rect${expandedIndex === i && artworks[i] ? ' rect--hidden' : ''}${!ready ? ' rect--loading' : ''}`}
            onClick={() => {
              if (expandedIndex !== null) return
              if (!artworks[i]) return
              const originEl = gridRef.current.querySelectorAll('.rect')[i]
              onImageClick(i, originEl.getBoundingClientRect())
            }}
          >
            <div className="rect-inner">
              <div
                className="rect-front"
                style={{
                  backgroundImage: art ? `url(${art.imageUrl})` : undefined,
                  backgroundColor: art ? undefined : `hsl(${(i / TOTAL) * 360}, 70%, 60%)`,
                }}
              />
              <div className="rect-back">
                {art ? (
                  <>
                    <span className="rect-back-title">{art.title}</span>
                    <span className="rect-back-artist">{art.artist}</span>
                    <span className="rect-back-year">{art.year}</span>
                  </>
                ) : (
                  <span className="rect-loading-text">en cours de chargement...</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MetropolitanLayout
