import { useCallback, useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'

export const ROTATION_SPEED = 0.5

const TURN_TIME = (2 * Math.PI) / ROTATION_SPEED
const COHESIVE_TIME = TURN_TIME
const DISSOLVE_TIME = 3
const ASH_TIME = 4
const REFORM_TIME = 3
const PERIOD = COHESIVE_TIME + DISSOLVE_TIME + ASH_TIME + REFORM_TIME

const MIN_Y = -1.3
const MAX_Y = 1.7

export function phaseParams(t) {
  const p = t % PERIOD
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

export function applyDissolve(material, uniforms) {
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

export function applyDissolveToObject(root, uniforms) {
  const applied = []
  root.traverse((obj) => {
    if (obj.isMesh) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const m of mats) {
        if (m && !applied.includes(m)) {
          applyDissolve(m, uniforms)
          applied.push(m)
        }
      }
    }
  })
  return applied
}

export function useParfumTiming() {
  const { camera, gl } = useThree()
  const [hovered, setHovered] = useState(false)
  const frozenAtRef = useRef(null)
  const lastTRef = useRef(0)
  const timeOffsetRef = useRef(0)

  useEffect(() => {
    const onWheel = (e) => {
      if (!hovered) return
      const next = camera.position.z + e.deltaY * 0.003
      camera.position.z = Math.min(7, Math.max(2.2, next))
    }
    const el = gl.domElement
    el.addEventListener('wheel', onWheel, { passive: true })
    const onOver = () => {
      el.style.cursor = hovered ? 'grab' : ''
    }
    el.addEventListener('pointerover', onOver)
    el.addEventListener('pointerout', onOver)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerover', onOver)
      el.removeEventListener('pointerout', onOver)
    }
  }, [hovered, camera, gl])

  const groupProps = {
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
  }

  const getT = useCallback(
    (raw) => {
      const wasFrozen = frozenAtRef.current !== null
      let t
      if (hovered) {
        if (!wasFrozen) frozenAtRef.current = raw
        t = lastTRef.current
      } else {
        if (wasFrozen) {
          timeOffsetRef.current = raw - lastTRef.current
          frozenAtRef.current = null
        }
        t = raw - timeOffsetRef.current
        lastTRef.current = t
      }
      return t
    },
    [hovered],
  )

  return { hovered, getT, groupProps }
}