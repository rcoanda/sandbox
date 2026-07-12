import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'

const POINTS = [
  [-10, 0, 10],
  [-5, 5, 0],
  [0, 0, -10],
  [5, -5, 0],
  [10, 0, 10],
]

const COLORS = ['#e63946', '#ffb703', '#4cc9f0', '#ffffff', '#a0710b']

function MovingShape({ curve, index }) {
  const meshRef = useRef()
  const offset = index * 0.2

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.002 + offset) % 1
    const pos = curve.getPointAt(t)
    const look = curve.getPointAt((t + 0.01) % 1)

    meshRef.current.position.copy(pos)
    meshRef.current.lookAt(look)
    meshRef.current.rotation.z += Math.PI / 2
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color={COLORS[index]} side={2} />
    </mesh>
  )
}

function RandomScene() {
  const curve = useMemo(
    () => new CatmullRomCurve3(POINTS.map((p) => new Vector3(p[0], p[1], p[2])), true),
    [],
  )

  return (
    <>
      {COLORS.map((_, i) => (
        <MovingShape key={i} curve={curve} index={i} />
      ))}
    </>
  )
}

export default RandomScene
