import { useRef, useEffect } from 'react'
import '../../styles/geometrie/Suite.css'

function SuiteScene() {
  const cardsRef = useRef([])

  useEffect(() => {
    const shapes = cardsRef.current.map((card) => {
      const svg = card?.querySelector('svg')
      return { el: svg, x: 0, y: 0, tx: 0, ty: 0 }
    }).filter(s => s.el)

    const lerp = (a, b, n) => (1 - n) * a + n * b
    let mouse = { x: 0, y: 0 }

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('mousemove', onMouseMove)

    let animId
    const animate = () => {
      shapes.forEach((s, index) => {
        const speed = 0.05 + index * 0.02
        s.tx = mouse.x * 50
        s.ty = mouse.y * 50
        s.x = lerp(s.x, s.tx, speed)
        s.y = lerp(s.y, s.ty, speed)
        s.el.style.transform = `translate(${s.x}px, ${s.y}px) scale(${1 + Math.abs(s.x * 0.001)})`
      })
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="suite-layout">
      <div className="suite-grid">
        <div className="suite-card" ref={(el) => (cardsRef.current[0] = el)}>
          <svg viewBox="0 0 100 100">
            <rect x="25" y="25" width="50" height="50" fill="#e63946" />
          </svg>
        </div>
        <div className="suite-card" ref={(el) => (cardsRef.current[1] = el)}>
          <svg viewBox="0 0 100 100">
            <polygon points="50,20 80,80 20,80" fill="#ffb703" />
          </svg>
        </div>
        <div className="suite-card" ref={(el) => (cardsRef.current[2] = el)}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="25" fill="#4cc9f0" />
          </svg>
        </div>
        <div className="suite-card" ref={(el) => (cardsRef.current[3] = el)}>
          <svg viewBox="0 0 100 100">
            <rect x="30" y="30" width="40" height="40" fill="#fff" transform="rotate(45 50 50)" />
          </svg>
        </div>
        <div className="suite-card" ref={(el) => (cardsRef.current[4] = el)}>
          <svg viewBox="0 0 100 100">
            <polygon points="50,10 90,50 50,90 10,50" fill="#a0710b" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SuiteScene
