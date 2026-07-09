import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function StructuresScene() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = Math.sin(t * 0.2)
    groupRef.current.rotation.y = t * 0.3
  })

  const grid = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const idx = i * 8 + j
      grid.push(
        <mesh key={idx} position={[(i - 3.5) * 0.55, (j - 3.5) * 0.55, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshBasicMaterial color={`hsl(${(idx / 64) * 360}, 80%, 60%)`} wireframe />
        </mesh>
      )
    }
  }

  return <group ref={groupRef}>{grid}</group>
}

export default StructuresScene