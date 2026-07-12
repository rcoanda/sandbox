import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/structures/Grid.css'
import Informations from '../../composants/Informations'

const ROWS = 8
const COLS = 14

function Grid2D() {
  const gridRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const posRef = useRef([])
  const parallaxActive = useRef([])
  const expandedRef = useRef(null)
  const setXRef = useRef([])
  const setYRef = useRef([])
  const setRotRef = useRef([])
  const targetRef = useRef([])
  const currentRef = useRef([])

  const [rects] = useState(() =>
    Array.from({ length: ROWS * COLS }, () => ({
      hue: Math.random() * 360,
    }))
  )

  const [expandedIndex, setExpandedIndex] = useState(null)

  useEffect(() => {
    parallaxActive.current = new Array(ROWS * COLS).fill(true)

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

    parallaxActive.current[index] = false
    targetRef.current[index] = { x: 0, y: 0, rot: 0 }
    currentRef.current[index] = { x: 0, y: 0, rot: 0 }
    setXRef.current[index](0)
    setYRef.current[index](0)
    setRotRef.current[index](0)

    setExpandedIndex(index)
  }, [expandedIndex])

  const handleClose = useCallback(() => {
    const index = expandedIndex
    const originEl = gridRef.current.querySelectorAll('.rect')[index]
    const originRect = originEl.getBoundingClientRect()
    const targetEl = expandedRef.current

    gsap.to(targetEl, {
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      borderRadius: '6px',
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => {
        targetRef.current[index] = { x: 0, y: 0, rot: 0 }
        currentRef.current[index] = { x: 0, y: 0, rot: 0 }
        parallaxActive.current[index] = true
        setExpandedIndex(null)
      },
    })
  }, [expandedIndex])

  useEffect(() => {
    if (expandedIndex === null) return

    const originEl = gridRef.current.querySelectorAll('.rect')[expandedIndex]
    const originRect = originEl.getBoundingClientRect()
    const targetEl = expandedRef.current
    if (!targetEl) return

    const hue = rects[expandedIndex].hue
    const bgColor = `hsl(${hue}, 70%, 60%)`

    const vw = window.innerWidth
    const vh = window.innerHeight
    const targetW = vw * 0.8
    const targetH = vh * 0.8

    gsap.set(targetEl, {
      position: 'fixed',
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      margin: 0,
      borderRadius: '6px',
      zIndex: 100,
      backgroundColor: bgColor,
    })

    gsap.to(targetEl, {
      top: (vh - targetH) / 2,
      left: (vw - targetW) / 2,
      width: targetW,
      height: targetH,
      borderRadius: 0,
      backgroundColor: bgColor,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [expandedIndex, rects])

  return (
    <div className="grid-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="structure" />
      <div className="grid-layout" ref={gridRef} style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {rects.map((r, i) => (
          <div
            key={i}
            className={`rect${expandedIndex === i ? ' rect--hidden' : ''}`}
            style={{ backgroundColor: `hsl(${r.hue}, 70%, 60%)` }}
            onClick={(e) => handleRectClick(e, i)}
          />
        ))}
      </div>
      {expandedIndex !== null && (
        <div ref={expandedRef} className="expanded-rect">
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Grid2D
