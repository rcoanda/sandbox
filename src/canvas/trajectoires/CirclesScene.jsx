// Scène Circles : des rectangles colorés défilent sur des trajectoires
// circulaires générées par circlesTrajectory.
import MovingRect from './MovingRect'
import { circlesTrajectory } from '../../utils/circlesTrajectory'

export default function Scene() {
  const trajectories = circlesTrajectory()

  return (
    <group>
      {trajectories.map((props, i) => (
        <MovingRect key={i} {...props} />
      ))}
    </group>
  )
}
