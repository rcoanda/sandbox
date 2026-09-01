import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function fitFont(ctx, text, baseSize, fontFamily, weight, maxWidth) {
  let size = baseSize
  while (size > 10) {
    ctx.font = `${weight} ${size}px ${fontFamily}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 2
  }
  return `${weight} ${size}px ${fontFamily}`
}

function createLabelTexture({ brand, kind, details }) {
  const W = 420
  const H = 580
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, W, H)

  const m = 45
  const r = 40
  ctx.fillStyle = '#f6ecd9'
  roundedRectPath(ctx, m, m, W - 2 * m, H - 2 * m, r)
  ctx.fill()

  ctx.strokeStyle = '#c9a44a'
  ctx.lineWidth = 7
  roundedRectPath(ctx, m + 10, m + 10, W - 2 * m - 20, H - 2 * m - 20, r - 8)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = '#8a6d3b'
  ctx.font = 'italic 26px Georgia, serif'
  ctx.fillText('— · —', W / 2, 132)

  ctx.fillStyle = '#3a2e20'
  ctx.font = '600 28px Georgia, serif'
  ctx.fillText(kind ?? 'EAU DE PARFUM', W / 2, 172)

  ctx.fillStyle = '#1f1a12'
  ctx.font = fitFont(ctx, brand ?? 'NOCTURNE', 84, 'Georgia, serif', 700, W - 2 * m - 80)
  ctx.fillText(brand ?? 'NOCTURNE', W / 2, 330)

  ctx.strokeStyle = '#c9a44a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(m + 50, 425)
  ctx.lineTo(W - m - 50, 425)
  ctx.stroke()

  ctx.fillStyle = '#8a6d3b'
  ctx.font = 'italic 24px Georgia, serif'
  ctx.fillText(details ?? 'Paris · 50 ml', W / 2, 475)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  return texture
}

function ParfumScene({ brand, kind, details }) {
  const bottleRef = useRef()
  const labelTexture = useMemo(
    () => createLabelTexture({ brand, kind, details }),
    [brand, kind, details],
  )

  useFrame(({ clock }) => {
    if (bottleRef.current) {
      bottleRef.current.rotation.y = clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 4]} intensity={1.6} />
      <directionalLight position={[-4, -3, -2]} intensity={0.5} color="#a5d6ff" />
      <pointLight position={[0, 2.5, 3]} intensity={0.6} color="#ffffff" />

      <group ref={bottleRef} position={[0, -0.35, 0]}>
        <RoundedBox
          args={[1.4, 1.9, 0.72]}
          radius={0.16}
          smoothness={8}
          position={[0, -0.05, 0]}
        >
          <meshPhysicalMaterial
            color="#bfe3ff"
            transparent
            opacity={0.3}
            roughness={0.08}
            metalness={0.15}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </RoundedBox>

        <RoundedBox
          args={[1.12, 1.45, 0.5]}
          radius={0.12}
          smoothness={8}
          position={[0, -0.22, 0]}
        >
          <meshStandardMaterial
            color="#f4c2c2"
            transparent
            opacity={0.85}
            roughness={0.15}
            metalness={0.05}
          />
        </RoundedBox>

        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.34, 0.38, 0.14, 32]} />
          <meshStandardMaterial color="#e8c86b" metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, -0.05, 0.37]}>
          <planeGeometry args={[0.98, 1.35]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>

        <mesh position={[0, -0.05, -0.37]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.98, 1.35]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>

        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[0.13, 0.16, 0.22, 32]} />
          <meshStandardMaterial color="#e8c86b" metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[0.48, 0.42, 0.26]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    </group>
  )
}

export default ParfumScene