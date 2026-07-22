import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useThree } from '@react-three/fiber'
import LevitationScene from '../composants/3d/LevitationScene'

import TerreLuneScene from '../composants/cosmos/TerreLuneScene'
import K2Scene from '../composants/abstrait/K2Scene'
import HuitScene from '../composants/trajectoires/HuitScene'
import ApiScene from '../composants/galeriesApi/ApiScene'
import ReseauxScene from '../composants/structures/ReseauxScene'
import F0Scene from '../composants/geometrie/F0Scene'
import { useDico } from '../composants/Dico'
import Navigation from '../composants/Navigation'
import gsap from 'gsap'
import '../styles/Home.css'

const categories = [
  { id: 'geometrie', label: '01', Scene: F0Scene, bgClass: 'home-cell--geometrie', is2D: true },
  { id: '3d', label: '02', Scene: LevitationScene, bgClass: 'home-cell--3d' },
  { id: 'trajectoires', label: '03', Scene: HuitScene, bgClass: 'home-cell--trajectoires' },
  { id: 'cosmos', label: '04', Scene: TerreLuneScene, bgClass: 'home-cell--cosmos' },
  { id: 'abstrait', label: '05', Scene: K2Scene, bgClass: 'home-cell--abstrait', is2D: true, transparent: true },
  { id: 'structures', label: '06', Scene: ReseauxScene, bgClass: 'home-cell--structures' },
  { id: 'galeriesApi', label: '07', Scene: ApiScene, bgClass: 'home-cell--galeriesApi', is2D: true, transparent: true },
]

function CameraController({ id }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.z = id === 'cosmos' ? 8 : 4
  }, [id, camera])
  return null
}

function Preview({ activeCat }) {
  if (!activeCat) return null
  const { Scene, is2D, id, transparent } = activeCat

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <CameraController id={id} />
        {!is2D && <Scene />}
      </Canvas>
      {is2D && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Scene transparent={transparent} />
        </div>
      )}
    </div>
  )
}

function Home() {
  const navigate = useNavigate()
  const { lang } = useDico()
  const [commonJson, setCommonJson] = useState(null)

  useEffect(() => {
    fetch(`/lang/${lang}/pages/home.json`)
      .then((r) => r.json())
      .then((data) => setCommonJson(data))
      .catch(() => setCommonJson(null))
  }, [lang])

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
      geometrie: '/f0',
      '3d': '/levitation',
      trajectoires: '/huit',
      cosmos: '/terrelune',
      abstrait: '/k2d',
      structures: '/reseaux',
      galeriesApi: '/terre',
    }
    navigate(routes[id] || '/')
  }, [])

  const gridCats = categories.filter((c) => c.id !== 'galeriesApi')
  const col1 = gridCats.filter((_, i) => i % 2 === 0)
  const col2 = gridCats.filter((_, i) => i % 2 === 1)
  const galeriesApiCat = categories.find((c) => c.id === 'galeriesApi')

  return (
    <div className="home-page">
      <Navigation />
      <div className="home-preview">
        <Preview activeCat={activeCat} />
      </div>
      <div className="home-grid" ref={gridRef}>
        <div className="home-col">
          {col1.map((cat) => (
            <div key={cat.id} className={`home-cell ${cat.bgClass}${activeId === cat.id ? ' home-cell--active' : ''}`} onClick={() => handleCellClick(cat.id)} onMouseEnter={() => setActiveId(cat.id)}>
              <h2 className="home-cell-title">{commonJson?.categories?.[cat.id]}</h2>
              <div className="home-cell-footer">
                <span>{commonJson?.subtitle?.[cat.id]}</span>
                <span>{cat.label}</span>
              </div>
            </div>
          ))}
          <div className="home-diagonal" />
        </div>
        <div className="home-col">
          {col2.map((cat) => (
            <div key={cat.id} className={`home-cell ${cat.bgClass}${activeId === cat.id ? ' home-cell--active' : ''}`} onClick={() => handleCellClick(cat.id)} onMouseEnter={() => setActiveId(cat.id)}>
              <h2 className="home-cell-title">{commonJson?.categories?.[cat.id]}</h2>
              <div className="home-cell-footer">
                <span>{commonJson?.subtitle?.[cat.id]}</span>
                <span>{cat.label}</span>
              </div>
            </div>
          ))}
          <div className="home-diagonal" />
        </div>
        <div className="home-row-full">
          <div key={galeriesApiCat.id} className={`home-cell home-cell--full ${galeriesApiCat.bgClass}${activeId === galeriesApiCat.id ? ' home-cell--active' : ''}`} onClick={() => handleCellClick(galeriesApiCat.id)} onMouseEnter={() => setActiveId(galeriesApiCat.id)}>
            <h2 className="home-cell-title">{commonJson?.categories?.[galeriesApiCat.id]}</h2>
            <div className="home-cell-footer">
              <span>{commonJson?.subtitle?.[galeriesApiCat.id]}</span>
              <span>{galeriesApiCat.label}</span>
            </div>
          </div>
          <div className="home-diagonal" />
        </div>
      </div>
    </div>
  )
}

export default Home
