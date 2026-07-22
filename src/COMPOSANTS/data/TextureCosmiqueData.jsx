import { useState, useEffect } from 'react'
import * as THREE from 'three'

const COUNT = 60

function generateCosmicTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const hue = Math.random() * 360
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  grad.addColorStop(0, `hsla(${hue + Math.random() * 60}, 80%, 35%, 1)`)
  grad.addColorStop(0.3, `hsla(${hue + 30 + Math.random() * 60}, 60%, 15%, 0.9)`)
  grad.addColorStop(0.7, `hsla(${hue + 60}, 40%, 8%, 0.8)`)
  grad.addColorStop(1, `hsla(0, 0%, 3%, 1)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = Math.random() * 2.5
    const a = 0.3 + Math.random() * 0.7
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`
    ctx.fill()
  }

  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = 2 + Math.random() * 4
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3)
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6)
    ctx.beginPath()
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = 'srgb'
  return texture
}

export default function useTextureCosmiqueData() {
  const [textures, setTextures] = useState([])
  const [ready, setReady] = useState(false)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    Promise.resolve().then(() => {
      const tex = Array.from({ length: COUNT }, () => generateCosmicTexture())
      setTextures(tex)
      setImageUrls(tex.map((t) => t.image.toDataURL()))
      setReady(true)
    })
  }, [])

  return {
    ready,           // Booléen — vrai quand toutes les textures sont générées
    textures,        // Tableau de THREE.Texture
    loadingError: null, // null ici (génération locale sans risque d'erreur)
    getImageUrl: (i) => imageUrls[i] || null,             // (i) => string | null
    getMeta: () => ({ title: 'Texture cosmique', artist: 'Générée local' }), // (i) => { title, artist }
  }
}
