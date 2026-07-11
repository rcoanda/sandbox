import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import '../../styles/collections/Metropolitan.css'

const ROWS = 8
const COLS = 14
const TOTAL = ROWS * COLS
const API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'
const FETCH_LIMIT = 30

let cachedArtworks = null
let cachedReady = false

function Metropolitan() {
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

  const [artworks, setArtworks] = useState(() => cachedArtworks || [])
  const [ready, setReady] = useState(() => cachedReady || false)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)

  useEffect(() => {
    if (cachedArtworks) return

    let cancelled = false

    const fetchArtworks = async () => {
      try {
        const searchRes = await fetch(
          `${API_BASE}/search?q=art&isPublicDomain=true&hasImages=true`
        )
        const searchData = await searchRes.json()
        const ids = searchData.objectIDs || []

        const items = []
        for (let i = 0; i < ids.length && items.length < TOTAL; i += 5) {
          const batch = ids.slice(i, i + 5)
          const results = await Promise.allSettled(
            batch.map(id =>
              fetch(`${API_BASE}/objects/${id}`).then(r => r.json())
            )
          )
          for (const r of results) {
            if (r.status === 'fulfilled' && r.value.primaryImageSmall) {
              items.push({
                imageUrl: r.value.primaryImageSmall,
                title: r.value.title || 'Untitled',
                artist: r.value.artistDisplayName || 'Unknown Artist',
                year: r.value.objectDate || 'Unknown Year',
              })
              if (items.length >= FETCH_LIMIT) break
            }
          }
        }

        if (!cancelled) {
          cachedArtworks = items
          cachedReady = true
          setArtworks(items)
          setReady(true)
        }
      } catch {
        if (!cancelled) setReady(true)
      }
    }

    fetchArtworks()
    return () => { cancelled = true }
  }, [])

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

    parallaxActive.current[index] = false
    targetRef.current[index] = { x: 0, y: 0, rot: 0 }
    currentRef.current[index] = { x: 0, y: 0, rot: 0 }
    setXRef.current[index](0)
    setYRef.current[index](0)
    setRotRef.current[index](0)

    setExpandedIndex(index)
  }, [expandedIndex, artworks])

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
    })

    gsap.to(targetEl, {
      top: (vh - targetH) / 2,
      left: (vw - targetW) / 2,
      width: targetW,
      height: targetH,
      borderRadius: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [expandedIndex, artworks])

  useEffect(() => {
    if (expandedIndex === null) {
      setFlipped(false)
    }
    return () => clearTimeout(flipTimerRef.current)
  }, [expandedIndex])

  return (
    <div className="metropolitan-page">
      <BackArrow />
      <CategoryMenu category="collections" />
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
      {expandedIndex !== null && artworks[expandedIndex] && (
        <div ref={expandedRef} className="expanded-rect">
          <div
            className={'expanded-inner' + (flipped ? ' flipped' : '')}
            onMouseEnter={() => {
              flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
            }}
            onMouseMove={() => {
              if (flipped) return
              clearTimeout(flipTimerRef.current)
              flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
            }}
            onMouseLeave={() => {
              clearTimeout(flipTimerRef.current)
              setFlipped(false)
            }}
          >
            <div className="expanded-front">
              <img src={artworks[expandedIndex].imageUrl} alt={artworks[expandedIndex].title} />
            </div>
            <div className="expanded-back">
              <span className="rect-back-title">{artworks[expandedIndex].title}</span>
              <span className="rect-back-artist">{artworks[expandedIndex].artist}</span>
              <span className="rect-back-year">{artworks[expandedIndex].year}</span>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
      )}
    </div>
  )
}

export default Metropolitan
