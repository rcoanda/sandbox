import { useRef, useEffect } from 'react'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'

const SHAPES = [
  { label: 'Carré', render: (w, h) => <rect x={w * 0.25} y={h * 0.25} width={w * 0.5} height={h * 0.5} /> },
  { label: 'Triangle', render: (w, h) => <polygon points={`${w * 0.5},${h * 0.2} ${w * 0.8},${h * 0.8} ${w * 0.2},${h * 0.8}`} /> },
  { label: 'Cercle', render: (w, h) => <circle cx={w * 0.5} cy={h * 0.5} r={Math.min(w, h) * 0.25} /> },
  { label: 'Ligne', render: (w, h) => <line x1={w * 0.2} y1={h * 0.5} x2={w * 0.8} y2={h * 0.5} strokeWidth={4} /> },
  { label: 'Losange', render: (w, h) => <polygon points={`${w * 0.5},${h * 0.1} ${w * 0.9},${h * 0.5} ${w * 0.5},${h * 0.9} ${w * 0.1},${h * 0.5}`} /> },
  { label: 'Pentagone', render: (w, h) => {
    const pts = Array.from({ length: 5 }, (_, i) => {
      const a = (i * 2 * Math.PI) / 5 - Math.PI / 2
      return `${w * 0.5 + Math.cos(a) * w * 0.35},${h * 0.5 + Math.sin(a) * h * 0.35}`
    }).join(' ')
    return <polygon points={pts} />
  }},
  { label: 'Hexagone', render: (w, h) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (i * 2 * Math.PI) / 6 - Math.PI / 2
      return `${w * 0.5 + Math.cos(a) * w * 0.35},${h * 0.5 + Math.sin(a) * h * 0.35}`
    }).join(' ')
    return <polygon points={pts} />
  }},
  { label: 'Étoile', render: (w, h) => {
    const pts = Array.from({ length: 10 }, (_, i) => {
      const a = (i * Math.PI) / 5 - Math.PI / 2
      const r = i % 2 === 0 ? w * 0.4 : w * 0.16
      return `${w * 0.5 + Math.cos(a) * r},${h * 0.5 + Math.sin(a) * r}`
    }).join(' ')
    return <polygon points={pts} />
  }},
  { label: 'Croix', render: (w, h) => (
    <>
      <rect x={w * 0.35} y={h * 0.15} width={w * 0.3} height={h * 0.7} />
      <rect x={w * 0.15} y={h * 0.35} width={w * 0.7} height={h * 0.3} />
    </>
  )},
]

const COLORS = ['#e63946', '#ffb703', '#4cc9f0', '#a0710b', '#2ec4b6', '#e76f51', '#8b5cf6', '#06b6d4', '#f59e0b']

function Card({ label, render, color, index }) {
  const cardRef = useRef(null)
  const shapeRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    const shape = shapeRef.current
    if (!card || !shape) return

    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      shape.style.transition = 'transform 0.1s ease-out'
      shape.style.transform = `translate(${x * 30}px, ${y * 30}px) scale(1.1)`
    }

    const onLeave = () => {
      shape.style.transition = 'transform 0.5s ease-out'
      shape.style.transform = 'translate(0px, 0px) scale(1)'
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={cardRef} style={{
      width: 300, height: 300, background: '#152233',
      position: 'relative', overflow: 'hidden', cursor: 'crosshair',
    }}>
      <div style={{
        position: 'absolute', top: 10, left: 10,
        color: '#fff', fontSize: 10, textTransform: 'uppercase',
        letterSpacing: 1, zIndex: 1,
      }}>
        Project {index + 1} | {label}
      </div>
      <svg ref={shapeRef} viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {render(100, 100)}
      </svg>
      <style>{`svg polygon, svg rect, svg circle, svg line { fill: ${color}; stroke: none; } svg line { stroke: ${color}; }`}</style>
    </div>
  )
}

function Matrice() {
  const items = SHAPES.slice(0, 9)

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'auto',
      position: 'relative', background: '#0b1522',
    }}>
      <BackArrow />
      <CategoryMenu category="structure" />
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', padding: '40px 0',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 300px)',
          gap: 20,
        }}>
          {items.map((item, i) => (
            <Card key={i} index={i} label={item.label} render={item.render} color={COLORS[i]} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Matrice
