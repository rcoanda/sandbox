import { useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap'
import OverlayGrid from '../OverlayGrid'

const ROWS = 8
const COLS = 14
const TOTAL = ROWS * COLS

function MetropolitanLayout({ artworks, ready }) {
  const gridRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const posRef = useRef([])
  const parallaxActive = useRef([])
  const setXRef = useRef([])
  const setYRef = useRef([])
  const setRotRef = useRef([])
  const targetRef = useRef([])
  const currentRef = useRef([])

  const [expandedIndex, setExpandedIndex] = useState(null)
  const [originRect, setOriginRect] = useState(null)

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

  const handleRectClick = useCallback((e, index) => {
    if (expandedIndex !== null) return
    if (!artworks[index]) return

    const originEl = gridRef.current.querySelectorAll('.rect')[index]
    setOriginRect(originEl.getBoundingClientRect())

    parallaxActive.current[index] = false
    targetRef.current[index] = { x: 0, y: 0, rot: 0 }
    currentRef.current[index] = { x: 0, y: 0, rot: 0 }
    setXRef.current[index](0)
    setYRef.current[index](0)
    setRotRef.current[index](0)

    setExpandedIndex(index)
  }, [expandedIndex, artworks])

  const handleClose = useCallback(() => {
    if (expandedIndex === null) return
    const index = expandedIndex
    targetRef.current[index] = { x: 0, y: 0, rot: 0 }
    currentRef.current[index] = { x: 0, y: 0, rot: 0 }
    parallaxActive.current[index] = true
    setExpandedIndex(null)
  }, [expandedIndex])

  return (
    <>
      <div className="metropolitan-layout" ref={gridRef} style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: TOTAL }, (_, i) => {
          const art = artworks[i]
          return (
            <div
              key={i}
              className={`rect${expandedIndex === i && artworks[i] ? ' rect--hidden' : ''}${!ready ? ' rect--loading' : ''}`}
              onClick={(e) => handleRectClick(e, i)}
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
      <OverlayGrid
        isOpen={expandedIndex !== null && artworks[expandedIndex]}
        imageSrc={artworks[expandedIndex]?.imageUrl}
        onClose={handleClose}
        originRect={originRect}
      >
        <span className="rect-back-title">{artworks[expandedIndex]?.title}</span>
        <span className="rect-back-artist">{artworks[expandedIndex]?.artist}</span>
        <span className="rect-back-year">{artworks[expandedIndex]?.year}</span>
      </OverlayGrid>
    </>
  )
}

export default MetropolitanLayout
