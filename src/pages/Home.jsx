import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import GeometrieScene from '../composants/GeometrieScene'
import SceneTrajectoires from '../composants/SceneTrajectoires'
import CosmosScene from '../composants/CosmosScene'
import AbstraitScene from '../composants/AbstraitScene'
import CollectionsScene from '../composants/CollectionsScene'
import StructuresScene from '../composants/StructuresScene'
import Scene2D from '../composants/Scene2D'
import gsap from 'gsap'
import '../styles/Home.css'

const categories = [
  { id: 'geometrie', title: 'Géométrie', label: '01', Scene: Scene2D, bgClass: 'home-cell--geometrie', is2D: true },
  { id: '3d', title: '3D', label: '02', Scene: GeometrieScene, bgClass: 'home-cell--3d' },
  { id: 'trajectoires', title: 'Trajectoires', label: '03', Scene: SceneTrajectoires, bgClass: 'home-cell--trajectoires' },
  { id: 'cosmos', title: 'Cosmos', label: '04', Scene: CosmosScene, bgClass: 'home-cell--cosmos' },
  { id: 'abstrait', title: 'Abstrait', label: '05', Scene: AbstraitScene, bgClass: 'home-cell--abstrait' },
  { id: 'structures', title: 'Structures', label: '06', Scene: StructuresScene, bgClass: 'home-cell--structures' },
  { id: 'collections', title: 'Collections & Défilés', label: '07', Scene: CollectionsScene, bgClass: 'home-cell--collections' },
]

function Preview({ activeCat }) {
  if (!activeCat) return null
  const { Scene, is2D, id } = activeCat

  if (is2D) {
    return <Scene />
  }

  return (
    <Canvas camera={{ position: [0, 0, id === 'cosmos' ? 5 : 4], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <Scene />
    </Canvas>
  )
}

function Home() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState('geometrie')
  const gridRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetsRef = useRef([])
  const currentsRef = useRef([])
  const setterXRef = useRef([])
  const setterYRef = useRef([])

  const activeCat = categories.find((c) => c.id === activeId)

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
      geometrie: '/f1',
      '3d': '/satelite',
      trajectoires: '/lemniscate',
      cosmos: '/cosmos',
      abstrait: '/k2d',
      structures: '/grid',
      collections: '/nasa',
    }
    window.location.href = routes[id] || '/'
  }, [])

  const col1 = categories.filter((_, i) => i % 2 === 0)
  const col2 = categories.filter((_, i) => i % 2 === 1)

  return (
    <div className="home-page">
      <nav className="home-nav">
        <button onClick={() => navigate('/about')} className="home-nav-link">A propos</button>
        <button onClick={() => navigate('/contact')} className="home-nav-link">Contact</button>
      </nav>
      <div className="home-preview">
        <Preview activeCat={activeCat} />
      </div>
      <div className="home-grid" ref={gridRef}>
        <div className="home-col">
          {col1.map((cat) => (
            <div key={cat.id} className={`home-cell ${cat.bgClass}${activeId === cat.id ? ' home-cell--active' : ''}`} onClick={() => handleCellClick(cat.id)} onMouseEnter={() => setActiveId(cat.id)}>
              <h2 className="home-cell-title">{cat.title}</h2>
              <div className="home-cell-footer">
                <span>Explorer</span>
                <span>{cat.label}</span>
              </div>
            </div>
          ))}
          <div className="home-diagonal" />
        </div>
        <div className="home-col">
          {col2.map((cat) => (
            <div key={cat.id} className={`home-cell ${cat.bgClass}${activeId === cat.id ? ' home-cell--active' : ''}`} onClick={() => handleCellClick(cat.id)} onMouseEnter={() => setActiveId(cat.id)}>
              <h2 className="home-cell-title">{cat.title}</h2>
              <div className="home-cell-footer">
                <span>Explorer</span>
                <span>{cat.label}</span>
              </div>
            </div>
          ))}
          <div className="home-diagonal" />
        </div>
      </div>
    </div>
  )
}

export default Home
