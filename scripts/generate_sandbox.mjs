import * as THREE from 'three'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function toArrayBuffer(arrays) {
  const totalBytes = arrays.reduce((s, a) => s + a.byteLength, 0)
  const buf = new ArrayBuffer(totalBytes)
  const view = new DataView(buf)
  let offset = 0
  for (const arr of arrays) {
    new Uint8Array(buf, offset, arr.byteLength).set(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength))
    offset += arr.byteLength
  }
  return buf
}

function base64FromBuffer(buf) {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// ---------- Build geometries ----------
const shapes = [
  { type: 'box', color: 0xe74c3c, pos: [-0.8, 0.25, -0.5], args: [0.5, 0.5, 0.5] },
  { type: 'sphere', color: 0x3498db, pos: [0.8, 0.25, 0.5], args: [0.3, 24, 16] },
  { type: 'cone', color: 0x2ecc71, pos: [-0.6, 0.25, 0.7], args: [0.3, 0.5, 16] },
  { type: 'cylinder', color: 0xf39c12, pos: [0.6, 0.25, -0.7], args: [0.25, 0.25, 0.5, 16] },
  { type: 'torus', color: 0x9b59b6, pos: [0, 0.3, 0], args: [0.25, 0.1, 12, 16] },
  { type: 'box', color: 0x1abc9c, pos: [-1, 0.15, 0.2], args: [0.3, 0.3, 0.3] },
  { type: 'sphere', color: 0xe67e22, pos: [1, 0.15, -0.3], args: [0.15, 12, 8] },
  { type: 'cone', color: 0xe74c3c, pos: [-0.3, 0.15, -1], args: [0.2, 0.3, 12] },
  { type: 'cylinder', color: 0x3498db, pos: [0.3, 0.15, 1], args: [0.15, 0.15, 0.3, 12] },
  { type: 'torus', color: 0x2ecc71, pos: [-0.4, 0.2, 0.5], args: [0.15, 0.06, 8, 12] },
]

// Sandbox parts
const sandboxParts = [
  { type: 'box', color: 0xe8d5a3, pos: [0, -0.05, 0], args: [4, 0.1, 3] },
  { type: 'box', color: 0xa08050, pos: [0, 0.2, -1.5], args: [4, 0.4, 0.08] },
  { type: 'box', color: 0xa08050, pos: [0, 0.2, 1.5], args: [4, 0.4, 0.08] },
  { type: 'box', color: 0xa08050, pos: [-2, 0.2, 0], args: [0.08, 0.4, 3] },
  { type: 'box', color: 0xa08050, pos: [2, 0.2, 0], args: [0.08, 0.4, 3] },
]

function createGeometry(type, args) {
  const ctors = {
    box: THREE.BoxGeometry,
    sphere: THREE.SphereGeometry,
    cone: THREE.ConeGeometry,
    cylinder: THREE.CylinderGeometry,
    torus: THREE.TorusGeometry,
  }
  return new ctors[type](...args)
}

const allMeshes = []

// Process sandbox parts
sandboxParts.forEach((s, i) => {
  const geo = createGeometry(s.type, s.args)
  geo.computeVertexNormals()
  const pos = geo.getAttribute('position')
  const norm = geo.getAttribute('normal')
  const idx = geo.index
  allMeshes.push({ name: `Sandbox_${i}`, pos, norm, idx, color: s.color, translation: s.pos })
})

// Process shapes
shapes.forEach((s, i) => {
  const geo = createGeometry(s.type, s.args)
  geo.computeVertexNormals()
  const pos = geo.getAttribute('position')
  const norm = geo.getAttribute('normal')
  const idx = geo.index
  allMeshes.push({ name: `Shape_${i}`, pos, norm, idx, color: s.color, translation: s.pos })
})

// ---------- Build GLTF ----------
const bufferArrays = []
let byteOffset = 0
const bufferViews = []
const accessors = []
const meshes = []
const meshNodes = []
const materials = []
const materialMap = new Map()

function getMaterialIndex(color) {
  if (!materialMap.has(color)) {
    materialMap.set(color, materials.length)
    materials.push({ color })
  }
  return materialMap.get(color)
}

allMeshes.forEach(m => {
  const posData = new Float32Array(m.pos.array)
  const normData = new Float32Array(m.norm.array)
  const idxData = new (m.idx.array instanceof Uint16Array ? Uint16Array : Uint32Array)(m.idx.array)

  const posByteLen = posData.byteLength
  const normByteLen = normData.byteLength
  const idxByteLen = idxData.byteLength

  // Position accessor
  const posBVIdx = bufferViews.length
  bufferViews.push({ byteOffset, byteLength: posByteLen, target: 34962 })
  let pMin = [Infinity, Infinity, Infinity], pMax = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < posData.length; i += 3) {
    pMin[0] = Math.min(pMin[0], posData[i])
    pMin[1] = Math.min(pMin[1], posData[i + 1])
    pMin[2] = Math.min(pMin[2], posData[i + 2])
    pMax[0] = Math.max(pMax[0], posData[i])
    pMax[1] = Math.max(pMax[1], posData[i + 1])
    pMax[2] = Math.max(pMax[2], posData[i + 2])
  }
  accessors.push({
    bufferView: posBVIdx,
    componentType: 5126,
    count: posData.length / 3,
    type: 'VEC3',
    min: pMin,
    max: pMax,
  })
  byteOffset += posByteLen
  bufferArrays.push(posData)

  // Normal accessor
  const normBVIdx = bufferViews.length
  bufferViews.push({ byteOffset, byteLength: normByteLen, target: 34962 })
  accessors.push({
    bufferView: normBVIdx,
    componentType: 5126,
    count: normData.length / 3,
    type: 'VEC3',
  })
  byteOffset += normByteLen
  bufferArrays.push(normData)

  // Index accessor
  const idxBVIdx = bufferViews.length
  bufferViews.push({ byteOffset, byteLength: idxByteLen, target: 34963 })
  accessors.push({
    bufferView: idxBVIdx,
    componentType: idxData instanceof Uint16Array ? 5123 : 5125,
    count: idxData.length,
    type: 'SCALAR',
  })
  byteOffset += idxByteLen
  bufferArrays.push(idxData)

  const matIdx = getMaterialIndex(m.color)
  const posAccIdx = accessors.length - 3
  const normAccIdx = accessors.length - 2
  const idxAccIdx = accessors.length - 1

  meshes.push({
    primitives: [{
      attributes: { POSITION: posAccIdx, NORMAL: normAccIdx },
      indices: idxAccIdx,
      material: matIdx,
    }],
  })

  const meshIdx = meshes.length - 1
  meshNodes.push({
    mesh: meshIdx,
    translation: m.translation,
    name: m.name,
  })
})

// Build materials
const matList = materials.map((m, i) => {
  const hex = m.color
  const r = ((hex >> 16) & 0xff) / 255
  const g = ((hex >> 8) & 0xff) / 255
  const b = (hex & 0xff) / 255
  return {
    name: `Mat_${i}`,
    pbrMetallicRoughness: {
      baseColorFactor: [r, g, b, 1],
      metallicFactor: 0.1,
      roughnessFactor: 0.4,
    },
  }
})

// Animation: rotation on Y for all shape nodes
const shapeNodes = meshNodes.filter((n, i) => i >= sandboxParts.length)
const animNodeIndices = shapeNodes.map(n => meshNodes.indexOf(n))

const animDuration = 4 // seconds
const keyframes = 30
const times = new Float32Array(keyframes)
const rotations = new Float32Array(keyframes * 4)

for (let k = 0; k < keyframes; k++) {
  const t = k / (keyframes - 1)
  times[k] = t * animDuration
  const angle = t * Math.PI * 2
  // Quaternion for rotation around Y axis
  const half = angle / 2
  rotations[k * 4] = 0
  rotations[k * 4 + 1] = Math.sin(half)
  rotations[k * 4 + 2] = 0
  rotations[k * 4 + 3] = Math.cos(half)
}

// Add animation data to buffer
const timeByteLen = times.byteLength
const rotByteLen = rotations.byteLength

const animTimeBVIdx = bufferViews.length
bufferViews.push({ byteOffset, byteLength: timeByteLen })
const animTimeAccIdx = accessors.length
accessors.push({
  bufferView: animTimeBVIdx,
  componentType: 5126,
  count: keyframes,
  type: 'SCALAR',
  min: [0],
  max: [animDuration],
})
byteOffset += timeByteLen
bufferArrays.push(times)

const animRotBVIdx = bufferViews.length
bufferViews.push({ byteOffset, byteLength: rotByteLen })
const animRotAccIdx = accessors.length
accessors.push({
  bufferView: animRotBVIdx,
  componentType: 5126,
  count: keyframes,
  type: 'VEC4',
})
byteOffset += rotByteLen
bufferArrays.push(rotations)

// Create animation channel for each shape node
const channels = []
const samplers = []

animNodeIndices.forEach(nodeIdx => {
  const samplerIdx = samplers.length
  samplers.push({
    input: animTimeAccIdx,
    interpolation: 'LINEAR',
    output: animRotAccIdx,
  })
  channels.push({
    sampler: samplerIdx,
    target: { node: nodeIdx, path: 'rotation' },
  })
})

const anim = {
  name: 'SpinShapes',
  channels,
  samplers,
}

// ---------- Assemble GLTF ----------
const bin = toArrayBuffer(bufferArrays)
const bufBase64 = base64FromBuffer(bin)

const rootNodeIdx = meshNodes.length
const sceneNodeIdx = rootNodeIdx + 1

const gltf = {
  asset: { version: '2.0', generator: 'sandbox-script' },
  scene: 0,
  scenes: [{ nodes: [sceneNodeIdx] }],
  nodes: [
    ...meshNodes,
    { children: meshNodes.map((_, i) => i), name: 'Root' },
    { children: [rootNodeIdx], name: 'Scene' },
  ],
  meshes,
  accessors,
  bufferViews,
  buffers: [{ uri: `data:application/octet-stream;base64,${bufBase64}`, byteLength: bin.byteLength }],
  materials: matList,
  animations: [anim],
}

writeFileSync(join(__dirname, '..', 'public', 'sandbox.gltf'), JSON.stringify(gltf, null, 2))
console.log(`Generated public/sandbox.gltf (${bin.byteLength} bytes buffer)`)
