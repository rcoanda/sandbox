function smooth(points) {
  if (!points.length) return ''
  const [x0, y0] = points[0]
  let d = `M ${x0} ${y0}`
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1]
    const [x, y] = points[i]
    const mx = (px + x) / 2
    const my = (py + y) / 2
    d += ` Q ${px} ${py} ${mx} ${my}`
  }
  const [lx, ly] = points[points.length - 1]
  d += ` L ${lx} ${ly}`
  return d
}

function knotPoints(p, q, phaseDeg, n) {
  const pts = []
  const ph = (phaseDeg * Math.PI) / 180
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * 2 * Math.PI
    const r = Math.cos(q * u) + 2
    const xi = r * Math.cos(p * u)
    const yi = r * Math.sin(p * u)
    const xr = xi * Math.cos(ph) - yi * Math.sin(ph)
    const yr = xi * Math.sin(ph) + yi * Math.cos(ph)
    pts.push([xr, yr])
  }
  return pts
}

function fitPoints(series, w, h, margin) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const pts of series) {
    for (const [x, y] of pts) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  const sx = (w - 2 * margin) / (maxX - minX)
  const sy = (h - 2 * margin) / (maxY - minY)
  const s = Math.min(sx, sy)
  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2
  return series.map((pts) =>
    pts.map(([x, y]) => [
      Math.round(w / 2 + (x - midX) * s),
      Math.round(h / 2 + (y - midY) * s),
    ]),
  )
}

function buildTube(segments) {
  const points = []
  for (const seg of segments) {
    if (Array.isArray(seg[0])) points.push(...seg)
    else points.push(seg)
  }
  return smooth(points)
}

function Circuit2DScene() {
  const w = 400
  const h = 500
  const bg = '#000000'
  const frameColor = '#000000'

  const definitions = [
    { id: 'tube-1', color: '#1f77b4', duration: '3.2s', delay: '0s', phase: 0 },
    { id: 'tube-2', color: '#2ca02c', duration: '4.1s', delay: '0.6s', phase: 120 },
    { id: 'tube-3', color: '#d62728', duration: '3.7s', delay: '1.2s', phase: 240 },
  ]
  const raw = definitions.map((t) => knotPoints(2, 3, t.phase, 240))
  const fitted = fitPoints(raw, w, h, 40)
  const tubes = definitions.map((t, i) => ({
    ...t,
    d: buildTube(fitted[i]),
  }))

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className="circuit-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width={w} height={h} rx="10" fill={frameColor} />

      <circle
        cx="200"
        cy="250"
        r="200"
        fill={bg}
        stroke="none"
      />

      <style>{`
        .circuit-flow {
          stroke-dasharray: 48 96;
          animation: circuit-fill 3s linear infinite;
        }
        @keyframes circuit-fill {
          from { stroke-dashoffset: 144; }
          to { stroke-dashoffset: -144; }
        }
      `}</style>

      {tubes.map((t) => (
        <g key={t.id}>
          <path
            d={t.d}
            fill="none"
            stroke={frameColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="circuit-flow"
            d={t.d}
            fill="none"
            stroke={t.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animationDuration: t.duration, animationDelay: t.delay }}
          />
        </g>
      ))}
    </svg>
  )
}

export default Circuit2DScene
