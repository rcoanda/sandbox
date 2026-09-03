import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import {
  PHOENIX_BRAND_FONT,
  PHOENIX_HEIGHT,
  PHOENIX_WIDTH,
} from '../graphisme/phoenixLabelDesign.js'
import { usePhoenixRectoSvg } from '../graphisme/phoenixRectoSvg'
import { phoenixVersoSvg } from '../graphisme/pheonixVersoSvg'

const ROTATION_SPEED = 0.5
const TURN_TIME = (2 * Math.PI) / ROTATION_SPEED
const COHESIVE_TIME = 2 * TURN_TIME
const DISSOLVE_TIME = 3
const ASH_TIME = 4
const REFORM_TIME = 3
const PERIOD = COHESIVE_TIME + DISSOLVE_TIME + ASH_TIME + REFORM_TIME

const MIN_Y = -1.3
const MAX_Y = 1.7

const GLASS = [191, 227, 255]
const LIQUID = [244, 194, 194]
const METAL = [232, 200, 107]
const GOLD = [212, 175, 55]
const GREY = [0.55, 0.53, 0.5]

const LABEL_W = PHOENIX_WIDTH
const LABEL_H = PHOENIX_HEIGHT

function svgToTexture(svgString, { fill } = {}) {
  return new Promise((resolve) => {
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = LABEL_W
      canvas.height = LABEL_H
      const ctx = canvas.getContext('2d')
      if (fill) {
        ctx.fillStyle = fill
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      resolve(texture)
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}



function applyDissolve(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDissolve = uniforms.uDissolve

    shader.vertexShader =
      'uniform float uDissolve;\nvarying vec3 vDissolvePos;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>

        vDissolvePos = (modelMatrix * vec4(position, 1.0)).xyz;`,
      )

    shader.fragmentShader =
      'uniform float uDissolve;\nvarying vec3 vDissolvePos;\n' +
      shader.fragmentShader.replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>

        vec3 parfumP = fract(vDissolvePos * 3.7 * 0.3183099 + 0.1) * 17.0;
        float parfumH = fract(parfumP.x * parfumP.y * parfumP.z * (parfumP.x + parfumP.y + parfumP.z));
        float dissolveY = clamp((vDissolvePos.y - ${MIN_Y.toFixed(2)}) / (${MAX_Y.toFixed(2)} - ${MIN_Y.toFixed(2)}), 0.0, 1.0);
        if (dissolveY * 0.55 + parfumH * 0.45 < uDissolve) discard;`,
      )
  }
  return material
}

function sampleBoxSurface({ cx, cy, cz, w, h, d, count, jitter = 0.03 }) {
  const pts = []
  const hw = w / 2
  const hh = h / 2
  const hd = d / 2
  for (let i = 0; i < count; i++) {
    const axis = Math.floor(Math.random() * 6)
    const sign = axis % 2 === 0 ? 1 : -1
    const a = Math.random() * 2 - 1
    const b = Math.random() * 2 - 1
    let x
    let y
    let z
    if (axis < 2) {
      x = sign * hw
      y = a * hh
      z = b * hd
    } else if (axis < 4) {
      y = sign * hh
      x = a * hw
      z = b * hd
    } else {
      z = sign * hd
      x = a * hw
      y = b * hh
    }
    x += (Math.random() * 2 - 1) * jitter
    y += (Math.random() * 2 - 1) * jitter
    z += (Math.random() * 2 - 1) * jitter
    pts.push([x + cx, y + cy, z + cz])
  }
  return pts
}

function sampleCylinderSurface({ cx, cy, cz, radius, height, count }) {
  const pts = []
  const caps = Math.floor(count * 0.3)
  for (let i = 0; i < count; i++) {
    if (i < caps) {
      const sign = i % 2 === 0 ? 1 : -1
      const rr = radius * Math.random()
      const a = Math.random() * Math.PI * 2
      pts.push([cx + Math.cos(a) * rr, cy + (sign * height) / 2, cz + Math.sin(a) * rr])
    } else {
      const a = Math.random() * Math.PI * 2
      const yy = cy + (Math.random() * 2 - 1) * (height / 2)
      pts.push([cx + Math.cos(a) * radius, yy, cz + Math.sin(a) * radius])
    }
  }
  return pts
}

function buildParticles() {
  const pts = []
  const push = (samples, rgb) => {
    for (const [x, y, z] of samples) pts.push({ x, y, z, r: rgb[0], g: rgb[1], b: rgb[2] })
  }

  push(
    sampleBoxSurface({ cx: 0, cy: -0.05, cz: 0, w: 1.4, h: 1.9, d: 0.72, count: 3400 }),
    GLASS,
  )
  push(
    sampleBoxSurface({ cx: 0, cy: -0.22, cz: 0, w: 1.12, h: 1.45, d: 0.5, count: 1400 }),
    LIQUID,
  )
  push(
    sampleCylinderSurface({ cx: 0, cy: 0.95, cz: 0, radius: 0.36, height: 0.14, count: 140 }),
    METAL,
  )
  push(
    sampleCylinderSurface({ cx: 0, cy: 1.12, cz: 0, radius: 0.145, height: 0.22, count: 120 }),
    METAL,
  )
  push(
    sampleBoxSurface({ cx: 0, cy: 1.42, cz: 0, w: 0.48, h: 0.42, d: 0.26, count: 360 }),
    GOLD,
  )

  const n = pts.length
  const basePositions = new Float32Array(n * 3)
  const baseColors = new Float32Array(n * 3)
  const drift = new Float32Array(n * 3)
  const depth = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    const k = i * 3
    basePositions[k] = pts[i].x
    basePositions[k + 1] = pts[i].y
    basePositions[k + 2] = pts[i].z
    baseColors[k] = pts[i].r / 255
    baseColors[k + 1] = pts[i].g / 255
    baseColors[k + 2] = pts[i].b / 255

    drift[k] = (Math.random() * 2 - 1) * 0.2
    drift[k + 1] = (Math.random() * 2 - 1) * 0.3
    drift[k + 2] = (Math.random() * 2 - 1) * 0.2
    depth[i] = 0.6 + Math.random() * 1.6
  }

  return { n, basePositions, baseColors, drift, depth }
}

function phaseParams(t) {
  const p = (t % PERIOD)
  let s
  let a

  if (p < COHESIVE_TIME) {
    s = 0
    a = 0
  } else if (p < COHESIVE_TIME + DISSOLVE_TIME) {
    const k = (p - COHESIVE_TIME) / DISSOLVE_TIME
    s = k
    a = k
  } else if (p < COHESIVE_TIME + DISSOLVE_TIME + ASH_TIME) {
    s = 1
    a = Math.max(0, 1 - (p - COHESIVE_TIME - DISSOLVE_TIME) / ASH_TIME)
  } else {
    const k = (p - (PERIOD - REFORM_TIME)) / REFORM_TIME
    s = 1 - k
    a = Math.sin(k * Math.PI)
  }

  return { s, a }
}

function ParfumScene() {
  const bottleRef = useRef()
  const pointsMatRef = useRef()
  const [labelTexture, setLabelTexture] = useState(null)
  const [backMap, setBackMap] = useState(null)
  const rectoSvgString = usePhoenixRectoSvg()
  const { n, basePositions, baseColors, drift, depth } = useMemo(() => buildParticles(), [])

  // verso : import direct depuis pheonixVersoSvg (uniformisé avec recto)
  useEffect(() => {
    let cancelled = false
    svgToTexture(phoenixVersoSvg()).then((tex) => {
      if (!cancelled && tex) setBackMap(tex)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // recto : import direct depuis phoenixRectoSvg (uniformisé avec verso)
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (document.fonts?.load) {
        await document.fonts.load(`400 84px ${PHOENIX_BRAND_FONT}`).catch(() => {})
        await document.fonts.ready.catch(() => {})
        if (cancelled) return
      }
      const tex = await svgToTexture(rectoSvgString)
      if (!cancelled && tex) {
        setLabelTexture((prev) => {
          if (prev) prev.dispose()
          return tex
        })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [rectoSvgString])

  const materials = useMemo(() => {
    const uniforms = { uDissolve: { value: 0 } }
    const glass = applyDissolve(
      new THREE.MeshPhysicalMaterial({
        color: '#bfe3ff',
        transparent: true,
        opacity: 0.3,
        roughness: 0.08,
        metalness: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      uniforms,
    )
    const liquid = applyDissolve(
      new THREE.MeshStandardMaterial({
        color: '#f4c2c2',
        transparent: true,
        opacity: 0.85,
        roughness: 0.15,
        metalness: 0.05,
      }),
      uniforms,
    )
    const collar = applyDissolve(
      new THREE.MeshStandardMaterial({ color: '#e8c86b', metalness: 0.9, roughness: 0.2 }),
      uniforms,
    )
    const stem = applyDissolve(
      new THREE.MeshStandardMaterial({ color: '#e8c86b', metalness: 0.9, roughness: 0.2 }),
      uniforms,
    )
    const cap = applyDissolve(
      new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.85, roughness: 0.25 }),
      uniforms,
    )
    const fabric = applyDissolve(
      new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true }),
      uniforms,
    )
    const backFab = applyDissolve(
      new THREE.MeshBasicMaterial({ map: backMap, transparent: true }),
      uniforms,
    )
    return { uniforms, glass, liquid, collar, stem, cap, fabric, backMap, backFab }
  }, [labelTexture, backMap])

  useEffect(() => {
    return () => {
      const mats = [materials.glass, materials.liquid, materials.collar, materials.stem, materials.cap, materials.fabric, materials.backFab]
      for (const m of mats) {
        m.map = null
        m.dispose()
      }
    }
  }, [materials])

  useEffect(() => {
    return () => {
      if (backMap) backMap.dispose()
    }
  }, [backMap])

  useEffect(() => {
    return () => {
      if (labelTexture) labelTexture.dispose()
    }
  }, [labelTexture])

  const particles = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(basePositions, 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('color', new THREE.BufferAttribute(baseColors, 3))
    return geo
  }, [basePositions, baseColors])

  const posAttrRef = useRef(null)
  const colAttrRef = useRef(null)
  const dissolveRef = useRef(null)

  useEffect(() => {
    posAttrRef.current = particles.attributes.position
    colAttrRef.current = particles.attributes.color
  }, [particles])

  useEffect(() => {
    dissolveRef.current = materials.uniforms.uDissolve
  }, [materials])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const { s, a } = phaseParams(t)

    if (dissolveRef.current) dissolveRef.current.value = s

    if (bottleRef.current) {
      bottleRef.current.rotation.y = t * 0.5
    }

    const posAttr = posAttrRef.current
    if (!posAttr) return
    const colAttr = colAttrRef.current
    const pos = posAttr.array
    const col = colAttr.array

    for (let i = 0; i < n; i++) {
      const k = i * 3
      pos[k] = basePositions[k] + drift[k] * s
      pos[k + 1] = basePositions[k + 1] + drift[k + 1] * s - depth[i] * s
      pos[k + 2] = basePositions[k + 2] + drift[k + 2] * s

      col[k] = baseColors[k] + (GREY[0] - baseColors[k]) * s
      col[k + 1] = baseColors[k + 1] + (GREY[1] - baseColors[k + 1]) * s
      col[k + 2] = baseColors[k + 2] + (GREY[2] - baseColors[k + 2]) * s
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true

    if (pointsMatRef.current) pointsMatRef.current.opacity = a
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
          <primitive object={materials.glass} attach="material" />
        </RoundedBox>

        <RoundedBox
          args={[1.12, 1.45, 0.5]}
          radius={0.12}
          smoothness={8}
          position={[0, -0.22, 0]}
        >
          <primitive object={materials.liquid} attach="material" />
        </RoundedBox>

        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.34, 0.38, 0.14, 32]} />
          <primitive object={materials.collar} attach="material" />
        </mesh>

        <mesh position={[0, -0.05, 0.37]}>
          <planeGeometry args={[0.98, 1.35]} />
          <primitive object={materials.fabric} attach="material" />
        </mesh>

        <mesh position={[0, -0.05, -0.37]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.98, 1.35]} />
          <primitive object={materials.backFab} attach="material" />
        </mesh>

        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[0.13, 0.16, 0.22, 32]} />
          <primitive object={materials.stem} attach="material" />
        </mesh>

        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[0.48, 0.42, 0.26]} />
          <primitive object={materials.cap} attach="material" />
        </mesh>

        <points geometry={particles} name="ashes" frustumCulled={false}>
          <pointsMaterial
            ref={pointsMatRef}
            size={0.05}
            vertexColors
            transparent
            opacity={0}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      </group>
    </group>
  )
}

export default ParfumScene
