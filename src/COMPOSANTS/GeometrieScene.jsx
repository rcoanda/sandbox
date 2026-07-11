import { useRef, useEffect } from 'react'

const shapes2D = [
  { type: 'circle', x: 0.2, y: 0.2, r: 0.08, color: '#4f46e5', speed: 1.0 },
  { type: 'rect', x: 0.75, y: 0.25, w: 0.12, h: 0.12, color: '#ec4899', speed: 0.7 },
  { type: 'triangle', x: 0.3, y: 0.8, size: 0.1, color: '#f59e0b', speed: 1.3 },
  { type: 'circle', x: 0.8, y: 0.75, r: 0.06, color: '#06b6d4', speed: 0.9 },
  { type: 'rect', x: 0.5, y: 0.5, w: 0.1, h: 0.1, color: '#8b5cf6', speed: 0.5 },
]

function drawTriangle(ctx, cx, cy, size, angle) {
  const h = size * 1.5
  ctx.beginPath()
  ctx.moveTo(cx, cy - h / 2)
  ctx.lineTo(cx - size / 2, cy + h / 2)
  ctx.lineTo(cx + size / 2, cy + h / 2)
  ctx.closePath()
  ctx.fill()
}

function GeometrieScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const parent = canvas.parentElement
    const resize = () => {
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const startTime = performance.now()

    const draw = (time) => {
      const w = canvas.width
      const h = canvas.height
      const t = (time - startTime) / 1000

      ctx.clearRect(0, 0, w, h)

      shapes2D.forEach((s) => {
        const angle = t * s.speed
        const cx = s.x * w
        const cy = s.y * h

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(angle)
        ctx.fillStyle = s.color
        ctx.globalAlpha = 0.7 + Math.sin(t * s.speed * 0.5) * 0.2

        if (s.type === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, s.r * w, 0, Math.PI * 2)
          ctx.fill()
        } else if (s.type === 'rect') {
          ctx.fillRect(-(s.w * w) / 2, -(s.h * h) / 2, s.w * w, s.h * h)
        } else if (s.type === 'triangle') {
          drawTriangle(ctx, 0, 0, s.size * w, angle)
        }

        ctx.restore()
      })

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
}

export default GeometrieScene
