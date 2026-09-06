import { useCallback, useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PHOENIX_BRAND_FONT,
  PHOENIX_HEIGHT,
  PHOENIX_WIDTH,
} from '../graphisme/phoenixLabelDesign.js'
import { usePhoenixRectoSvg } from '../graphisme/phoenixRectoSvg'
import { phoenixVersoSvg } from '../graphisme/pheonixVersoSvg'

// Taille du canvas sur lequel les étiquettes SVG sont rasterisées.
const LABEL_W = PHOENIX_WIDTH
const LABEL_H = PHOENIX_HEIGHT

// Fabrique une texture WebGL à partir d'une chaîne SVG (data-URI).
// Rasterise le SVG sur un canvas (fond transparent vide sauf si `fill` est fourni),
// puis le convertit en THREE.CanvasTexture. Résout `null` si l'image échoue.
export function svgToTexture(svgString, { fill } = {}) {
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

// Charge les deux étiquettes phoenix (recto = marque/détails, verso = phoenix/lieu)
// en textures, partagées entre la scène WebGL et la scène GLB.
// Gère le chargement de la police, la suppression de l'ancienne texture et le nettoyage.
export function usePhoenixLabelTextures() {
  const rectoSvgString = usePhoenixRectoSvg()
  const [rectoTexture, setRectoTexture] = useState(null)
  const [versoTexture, setVersoTexture] = useState(null)

  // Verso : contenu statique (phoenix doré, "EAU DE PARFUM", "Paris · 50 ml").
  useEffect(() => {
    let cancelled = false
    svgToTexture(phoenixVersoSvg()).then((tex) => {
      if (!cancelled && tex) setVersoTexture(tex)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Recto : dépend de la marque/type/détails du dico, recharge à chaque changement.
  // On attend la police custom avant de rasteriser pour garder le rendu fidèle.
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (document.fonts?.load) {
        await document.fonts.load(`400 84px ${PHOENIX_BRAND_FONT}`).catch(() => { })
        await document.fonts.ready.catch(() => { })
        if (cancelled) return
      }
      const tex = await svgToTexture(rectoSvgString)
      if (!cancelled && tex) {
        setRectoTexture((prev) => {
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

  // Libère les textures GPU quand elles changent ou au démontage du composant.
  useEffect(() => {
    return () => {
      if (rectoTexture) rectoTexture.dispose()
      if (versoTexture) versoTexture.dispose()
    }
  }, [rectoTexture, versoTexture])

  return { rectoTexture, versoTexture }
}

// Vitesse de rotation autour de l'axe vertical (rad/s).
export const ROTATION_SPEED = 0.5

// Calendrier du cycle "Dissolve & Re-form" :
//   COHESIVE : le flacon intact (s = 0)
//   DISSOLVE : disparition progressive des faces (s : 0 → 1)
//   ASH      : l'objet est totalement dissous, les particules de cendre s'estompent (a : 1 → 0)
//   REFORM   : reconstruction (s : 1 → 0)
const TURN_TIME = (2 * Math.PI) / ROTATION_SPEED
const COHESIVE_TIME = TURN_TIME
const DISSOLVE_TIME = 3
const ASH_TIME = 4
const REFORM_TIME = 3
const PERIOD = COHESIVE_TIME + DISSOLVE_TIME + ASH_TIME + REFORM_TIME

// Bornes verticales du flacon, utilisées pour normaliser le seuil de dissolution.
const MIN_Y = -1.3
const MAX_Y = 1.7

// Calcule les paramètres de phase pour un instant t.
// Renvoie { s, a } : s = avancement de la dissolution (0 intact → 1 dissous),
// a = opacité des particules de cendre.
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

// Injecte le shader de dissolution dans un matériau Three.
// Une uniforme `uDissolve` (via `uniforms`) pilote le seuil : un fragment est
// éliminé (discard) selon un masque horizontal (dissolveY) bruité (parfumH).
export function applyDissolve(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDissolve = uniforms.uDissolve

    // Passe la position du sommet (espace monde) au fragment shader.
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

        // Bruit procédural pseudo-aléatoire (hash) pour des bords de dissolution irréguliers.
        vec3 parfumP = fract(vDissolvePos * 3.7 * 0.3183099 + 0.1) * 17.0;
        float parfumH = fract(parfumP.x * parfumP.y * parfumP.z * (parfumP.x + parfumP.y + parfumP.z));
        // Position verticale normalisée entre MIN_Y et MAX_Y.
        float dissolveY = clamp((vDissolvePos.y - ${MIN_Y.toFixed(2)}) / (${MAX_Y.toFixed(2)} - ${MIN_Y.toFixed(2)}), 0.0, 1.0);
        // Supprime le fragment quand (dissolution verticale + bruit) < seuil.
        if (dissolveY * 0.55 + parfumH * 0.45 < uDissolve) discard;`,
      )
  }
  return material
}

// Applique le shader de dissolution à tous les meshes d'une scène GLB.
// Parcourt chaque mesh et chaque matériau (dont les matériaux multiples),
// en évitant d'injecter deux fois le même matériau. Renvoie la liste appliquée.
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

// Hook qui orchestre le comportement interactif partagé :
//  - survol (hovered) : fige le temps de la scène ;
//  - molette : zoom de la caméra quand on survole ;
//  - curseur "grab" posé sur le canvas.
// Expose `getT(raw)` (temps gelé/libéré) et `groupProps` (gestionnaires de survol).
export function useParfumTiming() {
  const { camera, gl } = useThree()
  const [hovered, setHovered] = useState(false)
  const frozenAtRef = useRef(null)
  const lastTRef = useRef(0)
  const timeOffsetRef = useRef(0)

  // Écouteurs natifs rattachés au canvas : molette (zoom) + curseur selon survol.
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

  // Survole d'un objet 3D : passe l'état hovered aux gestionnaires du group.
  const groupProps = {
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
  }

  // Calcule le temps à utiliser :
  //  - pendant le survol, gèle le temps (on garde la dernière valeur) ;
  //  - sinon, reprend avec un décalage pour que l'animation continue où elle s'était arrêtée.
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