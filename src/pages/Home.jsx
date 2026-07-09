import { useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import GeometrieScene from '../composants/GeometrieScene'
import CosmosScene from '../composants/CosmosScene'
import AbstraitScene from '../composants/AbstraitScene'
import CollectionsScene from '../composants/CollectionsScene'
import gsap from 'gsap'
import '../styles/Home.css'

const categories = [
  { id: 'geometrie', title: 'Géométrie', label: '01', Scene: GeometrieScene, bgClass: 'home-cell--geometrie' },
  { id: 'cosmos', title: 'Cosmos', label: '02', Scene: CosmosScene, bgClass: 'home-cell--cosmos' },
  { id: 'abstrait', title: 'Abstrait', label: '03', Scene: AbstraitScene, bgClass: 'home-cell--abstrait' },
  { id: 'collections', title: 'Collections & Défilés', label: '04', Scene: CollectionsScene, bgClass: 'home-cell--collections' },
]

function Home() {
  const gridRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetsRef = useRef([])
  const currentsRef = useRef([])
  const setterXRef = useRef([])
  const setterYRef = useRef([])

  useEffect(() => {
    const cells = gridRef.current.querySelectorAll('.home-cell')
    const n = cells.length

    for (let i = 0; i < n; i++) {
      setterXRef.current[i] = gsap.quickSetter(cells[i], 'x', 'px')
      setterYRef.current[i] = gsap.quickSetter(cells[i], 'y', 'px')
      targetsRef.current[i] = { x: 0, y: 0 }
      currentsRef.current[i] = { x: 0, y: 0 }
    }

    const compute = () => {
      cells.forEach((el, i) => {
        targetsRef.current[i] = { x: 0, y: 0 }
        currentsRef.current[i] = { x: 0, y: 0 }
      })
    }

    compute()

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const { x: mx, y: my } = mouseRef.current
      for (let i = 0; i < n; i++) {
        const cell = cells[i]
        const b = cell.getBoundingClientRect()
        const cx = b.left + b.width / 2
        const cy = b.top + b.height / 2

        const dx = mx - cx
        const dy = my - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const strength = Math.max(0, 1 - dist / 800)

        const targetX = dx * 0.03 * strength
        const targetY = dy * 0.03 * strength

        currentsRef.current[i].x += (targetX - currentsRef.current[i].x) * 0.06
        currentsRef.current[i].y += (targetY - currentsRef.current[i].y) * 0.06

        setterXRef.current[i](currentsRef.current[i].x)
        setterYRef.current[i](currentsRef.current[i].y)
      }
    }

    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
    }
  }, [])

  const handleCellClick = useCallback((id) => {
    const routes = {
      geometrie: '/grid',
      cosmos: '/cosmos',
      abstrait: '/animation',
      collections: '/metropolitan',
    }
    window.location.href = routes[id] || '/'
  }, [])

  return (
    <div className="home-page">
      <div className="home-grid" ref={gridRef}>
        <div className="home-col">
          <div className={`home-cell ${categories[0].bgClass}`} onClick={() => handleCellClick(categories[0].id)}>
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
              <GeometrieScene />
            </Canvas>
            <h2 className="home-cell-title">{categories[0].title}</h2>
            <div className="home-cell-footer">
              <span>Explorer</span>
              <span>{categories[0].label}</span>
            </div>
          </div>
          <div className={`home-cell ${categories[2].bgClass}`} onClick={() => handleCellClick(categories[2].id)}>
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
              <AbstraitScene />
            </Canvas>
            <h2 className="home-cell-title">{categories[2].title}</h2>
            <div className="home-cell-footer">
              <span>Explorer</span>
              <span>{categories[2].label}</span>
            </div>
          </div>
          <div className="home-diagonal" />
        </div>
        <div className="home-col">
          <div className={`home-cell ${categories[1].bgClass}`} onClick={() => handleCellClick(categories[1].id)}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
              <CosmosScene />
            </Canvas>
            <h2 className="home-cell-title">{categories[1].title}</h2>
            <div className="home-cell-footer">
              <span>Explorer</span>
              <span>{categories[1].label}</span>
            </div>
          </div>
          <div className={`home-cell ${categories[3].bgClass}`} onClick={() => handleCellClick(categories[3].id)}>
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
              <CollectionsScene />
            </Canvas>
            <h2 className="home-cell-title">{categories[3].title}</h2>
            <div className="home-cell-footer">
              <span>Explorer</span>
              <span>{categories[3].label}</span>
            </div>
          </div>
          <div className="home-diagonal" />
        </div>
      </div>
    </div>
  )
}

export default Home
