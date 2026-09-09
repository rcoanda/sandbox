// Hook qui anime un objet le long d'une trajectoire circulaire : position et
// rotation mises à jour à chaque frame selon rayon, vitesse, direction et phase.
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function useCircularMotion(radius, speed, direction, phase = 0) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    const angle = t * direction + phase
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    ref.current.position.set(x, y, 0)
    ref.current.rotation.z = angle
  })

  return ref
}
