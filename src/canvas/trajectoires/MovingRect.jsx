// Rectangle coloré qui se déplace sur une trajectoire circulaire dans la
// scène Circles. Chaque instance garde une couleur aléatoire fixe.
import { useMemo } from 'react'
import { useCircularMotion } from '../../hooks/useCircularMotion'
import { randomColor } from '../../utils/colors'

export default function MovingRect({ radius, speed, direction, phase, length, width }) {
  const ref = useCircularMotion(radius, speed, direction, phase)
  const color = useMemo(() => randomColor(), [])

  return (
    <mesh ref={ref}>
      <planeGeometry args={[length, width]} />
      <meshBasicMaterial color={color} side={2} />
    </mesh>
  )
}
