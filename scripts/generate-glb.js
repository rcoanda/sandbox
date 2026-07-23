import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    constructor() { this.result = null; this.onload = null }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then(buf => {
        this.result = buf
        if (this.onload) this.onload({ target: this })
      })
    }
    readAsDataURL(blob) {
      blob.text().then(txt => {
        this.result = 'data:text/plain;base64,' + Buffer.from(txt).toString('base64')
        if (this.onload) this.onload({ target: this })
      })
    }
  }
}

const __dirname = new URL('.', import.meta.url).pathname

const scene = new THREE.Scene()

// --- Moon sphere ---
const moonGeo = new THREE.SphereGeometry(2, 32, 32)
const moonMat = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  roughness: 0.8,
  metalness: 0.1,
})
const moon = new THREE.Mesh(moonGeo, moonMat)
scene.add(moon)

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
dirLight.position.set(5, 10, 7)
scene.add(dirLight)

// --- Cosmonaut ---
const cosmonaut = new THREE.Group()

// Body (cylinder)
const bodyGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.5, 8)
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee })
const body = new THREE.Mesh(bodyGeo, bodyMat)
body.position.y = 0.25
cosmonaut.add(body)

// Helmet (sphere)
const helmetGeo = new THREE.SphereGeometry(0.2, 12, 12)
const helmetMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
const helmet = new THREE.Mesh(helmetGeo, helmetMat)
helmet.position.y = 0.7
cosmonaut.add(helmet)

// Visor (small sphere on front of helmet)
const visorGeo = new THREE.SphereGeometry(0.1, 8, 8)
const visorMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, emissive: 0x4488ff, emissiveIntensity: 0.3 })
const visor = new THREE.Mesh(visorGeo, visorMat)
visor.position.set(0, 0.7, 0.18)
cosmonaut.add(visor)

// Backpack
const packGeo = new THREE.BoxGeometry(0.2, 0.3, 0.15)
const packMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
const pack = new THREE.Mesh(packGeo, packMat)
pack.position.set(0, 0.3, -0.25)
cosmonaut.add(pack)

// Left leg
const legGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 6)
const legMat = new THREE.MeshStandardMaterial({ color: 0xdddddd })
const lLeg = new THREE.Mesh(legGeo, legMat)
lLeg.position.set(-0.12, 0, 0)
cosmonaut.add(lLeg)

// Right leg
const rLeg = new THREE.Mesh(legGeo.clone(), legMat)
rLeg.position.set(0.12, 0, 0)
cosmonaut.add(rLeg)

// Left arm
const armGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 6)
const armMat = new THREE.MeshStandardMaterial({ color: 0xdddddd })
const lArm = new THREE.Mesh(armGeo, armMat)
lArm.position.set(-0.32, 0.5, 0)
lArm.rotation.z = 0.2
cosmonaut.add(lArm)

// Right arm
const rArm = new THREE.Mesh(armGeo.clone(), armMat)
rArm.position.set(0.32, 0.5, 0)
rArm.rotation.z = -0.2
cosmonaut.add(rArm)

// Position the cosmonaut on the moon surface (radius 2)
// We'll animate it to orbit the moon at the surface
// The cosmonaut stands upright on the surface, so it needs to be
// rotated to stand on the sphere's surface normal

// We'll animate the cosmonaut orbiting at the equator
// y=0 plane, at distance radius=2 from center
const orbitRadius = 2.3 // slightly above surface
cosmonaut.position.set(orbitRadius, 0, 0)

// Rotate cosmonaut to stand on the sphere surface at this position
// At (orbitRadius, 0, 0), the surface normal is (1,0,0)
// The cosmonaut should have its up vector pointing in the normal direction
// For standard orientation: cosmonaut up is Y, so we need to rotate
// such that local Y points along (1,0,0)
// This means rotating 90 degrees around Z
cosmonaut.quaternion.setFromUnitVectors(
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(1, 0, 0).normalize()
)

scene.add(cosmonaut)

// --- Animation ---
// Cosmonaut orbits the moon: position rotates around Y axis
const times = [0, 10] // 0s and 10s
const positions = []
const rotations = [] // quaternions
const steps = 60
for (let i = 0; i <= steps; i++) {
  const frac = i / steps
  const angle = frac * Math.PI * 2
  const t = frac * 10

  // Position on orbit
  const x = Math.cos(angle) * orbitRadius
  const z = Math.sin(angle) * orbitRadius
  positions.push(x, 0, z)

  // Quaternion to stand on surface at this position
  const up = new THREE.Vector3(x, 0, z).normalize()
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    up
  )
  rotations.push(q.x, q.y, q.z, q.w)
}

// Create animation tracks
const posTrack = new THREE.VectorKeyframeTrack(
  '.position',
  Array.from({ length: steps + 1 }, (_, i) => i * (10 / steps)),
  positions
)

const rotTrack = new THREE.QuaternionKeyframeTrack(
  '.quaternion',
  Array.from({ length: steps + 1 }, (_, i) => i * (10 / steps)),
  rotations
)

const clip = new THREE.AnimationClip('Orbit', 10, [posTrack, rotTrack])

// Add animation to the cosmonaut node
cosmonaut.animations = [clip]
// Make the node name for animation targeting
cosmonaut.name = 'Cosmonaut'

// The animation target in GLTF is the node index, not the name
// We need to ensure the cosmonaut group is the animated node

scene.userData = { animatedNodes: ['Cosmonaut'] }

// --- Export to GLTF ---
const exporter = new GLTFExporter()

// Export as text GLTF JSON
exporter.parse(
  scene,
  (gltfJson) => {
    // If it's already an object, stringify
    const jsonStr = typeof gltfJson === 'object' ? JSON.stringify(gltfJson, null, 2) : gltfJson
    writeFileSync(resolve(__dirname, 'public/moon_walk.gltf'), jsonStr)
    console.log('GLTF generated: public/moon_walk.gltf')
  },
  (err) => console.error('GLTF export error:', err),
  { binary: false, animations: [clip] }
)
