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

function loop(cx, cy, r, dir = 1) {
  const pts = []
  const steps = 30
  for (let i = 0; i <= steps; i++) {
    const ang = (i / steps) * 2 * Math.PI
    pts.push([cx + dir * Math.round(r * Math.cos(ang)), cy + Math.round(r * Math.sin(ang))])
  }
  return pts
}

function buildTube(segments) {
  const points = []
  for (const seg of segments) {
    if (Array.isArray(seg[0])) points.push(...seg)
    else points.push(seg)
  }
  return smooth(points)
}

function LabyrintheScene() {
  const w = 400
  const h = 500
  const bg = '#ffe4ec'
  const frameColor = '#1a1c22'

  const tubes = [
    {
      id: 'tube-1',
      color: '#1f77b4',
      d: buildTube([
        [45, 15], [150, 35], [85, 75], [210, 80], [300, 65], [255, 120],
        [150, 125], [100, 165],
        loop(165, 175, 40),
        [225, 180], [300, 160], [250, 225], [140, 230], [95, 275],
        loop(215, 272, 42, -1),
        [270, 275], [250, 335], [145, 330], [90, 380],
        loop(205, 378, 40),
        [260, 380], [235, 440], [145, 435], [160, 500],
      ]),
    },
    {
      id: 'tube-2',
      color: '#2ca02c',
      d: buildTube([
        [12, 55], [105, 75], [55, 125], [165, 118], [225, 150],
        loop(245, 150, 40),
        [300, 140], [290, 200], [205, 205], [150, 250],
        loop(185, 248, 42, -1),
        [250, 250], [250, 310], [165, 315], [115, 360],
        loop(195, 358, 40),
        [250, 360], [240, 420], [160, 420], [120, 470],
        loop(195, 480, 38, -1),
        [235, 480], [230, 500],
      ]),
    },
    {
      id: 'tube-3',
      color: '#d62728',
      d: buildTube([
        [355, 12], [265, 45], [330, 90], [240, 110], [305, 160],
        loop(285, 172, 42, -1),
        [215, 178], [265, 230], [185, 245],
        loop(160, 255, 40, 1),
        [110, 245], [175, 300], [100, 320],
        loop(185, 320, 42, -1),
        [245, 325], [205, 385], [130, 385],
        loop(205, 385, 40, 1),
        [260, 390], [235, 445], [150, 445], [200, 500],
      ]),
    },
  ]

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className="labyrinthe-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width={w} height={h} rx="10" fill={frameColor} />

      <rect
        x="6"
        y="6"
        width={w - 12}
        height={h - 12}
        rx="8"
        fill={bg}
        stroke="none"
      />

      {tubes.map((t) => (
        <path
          key={t.id}
          d={t.d}
          fill="none"
          stroke={t.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

export default LabyrintheScene
