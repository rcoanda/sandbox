import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { frameText } from './portfoliosCommon'

const RADIUS = 5.5

function equatorPoint(i, n) {
  const angle = (2 * Math.PI * i) / n
  return [
    RADIUS * Math.cos(angle),
    0,
    RADIUS * Math.sin(angle),
  ]
}

function buildFrameTexture(site, index, total, lang) {
  const meta = frameText(site, index, total, lang)
  const c = document.createElement('canvas')
  c.width = 640
  c.height = 400
  const ctx = c.getContext('2d')

  ctx.fillStyle = '#151517'
  ctx.fillRect(0, 0, 640, 400)

  // sprocket holes (left and right)
  ctx.fillStyle = '#000000'
  for (let y = 10; y < 400; y += 22) {
    for (const x of [12, 628]) {
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // head
  ctx.font = '20px ui-monospace, Menlo, monospace'
  ctx.fillStyle = '#a29a9c'
  ctx.fillText(meta.headLeft, 46, 26)
  ctx.textAlign = 'right'
  ctx.fillText(meta.headRight, 594, 26)
  ctx.strokeStyle = '#2e2e34'
  ctx.beginPath()
  ctx.moveTo(46, 40)
  ctx.lineTo(594, 40)
  ctx.stroke()

  // projection screen
  const g = ctx.createLinearGradient(0, 50, 0, 292)
  g.addColorStop(0, site.accent)
  g.addColorStop(1, '#050507')
  ctx.fillStyle = g
  ctx.fillRect(40, 50, 560, 242)

  // brand name (auto-fitted)
  ctx.textAlign = 'center'
  ctx.font = 'bold 76px Georgia, serif'
  let size = 76
  while (size > 30 && ctx.measureText(site.name).width > 520) {
    size -= 2
    ctx.font = `bold ${size}px Georgia, serif`
  }
  ctx.fillStyle = site.accent
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)'
  ctx.shadowBlur = 18
  ctx.fillText(site.name, 320, 165)
  ctx.shadowBlur = 0

  // play chip
  ctx.font = '24px ui-monospace, Menlo, monospace'
  ctx.textAlign = 'center'
  const txt = meta.play
  const tw = ctx.measureText(txt).width
  ctx.fillStyle = 'rgba(5, 5, 7, 0.6)'
  ctx.fillRect(320 - tw / 2 - 18, 186, tw + 36, 40)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.strokeRect(320 - tw / 2 - 18, 186, tw + 36, 40)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(txt, 320, 213)

  // url
  ctx.font = '20px ui-monospace, Menlo, monospace'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.fillText(meta.screenUrl, 320, 262)

  // caption
  ctx.textAlign = 'left'
  ctx.font = '30px Georgia, serif'
  ctx.fillStyle = '#f4f0f0'
  ctx.fillText(site.name, 46, 326)
  ctx.textAlign = 'right'
  ctx.font = '26px ui-monospace, Menlo, monospace'
  ctx.fillStyle = site.accent
  ctx.fillText(meta.reel, 594, 326)

  // edge code + SMPTE bars
  ctx.strokeStyle = '#2e2e34'
  ctx.beginPath()
  ctx.moveTo(46, 338)
  ctx.lineTo(594, 338)
  ctx.stroke()
  const bars = ['#bdbdbd', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0']
  const barW = 88 / bars.length
  bars.forEach((color, j) => {
    ctx.fillStyle = color
    ctx.fillRect(46 + j * barW, 348, barW + 0.5, 9)
  })
  ctx.textAlign = 'left'
  ctx.font = '18px ui-monospace, Menlo, monospace'
  ctx.fillStyle = '#8d8285'
  ctx.fillText(meta.edge.slice(0, 42), 150, 357)

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 8
  return tex
}

/* Un "petit écran" film posé sur l'équateur de la sphère 3D :
   plan 3D texturé par un canvas (mêmes informations que Film2DScreen DOM). */

function Film3DScreen({ site, index, total, lang }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const texture = useMemo(() => buildFrameTexture(site, index, total, lang), [site, index, total, lang])
  const position = useMemo(() => equatorPoint(index, total), [index, total])

  useFrame(() => {
    if (!meshRef.current) return
    const target = hovered ? 1.08 : 1
    const s = meshRef.current.scale
    s.x += (target - s.x) * 0.12
    s.y = s.x
    s.z = s.x
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onUpdate={(self) => self.lookAt(0, 0, 0)}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        window.open(site.url, '_blank', 'noopener')
      }}
    >
      <planeGeometry args={[3.2, 2]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

export default Film3DScreen