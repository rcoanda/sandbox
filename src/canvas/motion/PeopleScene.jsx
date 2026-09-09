// Scène de la galerie People : des photos défilent sur des trajectoires
// circulaires, la source des photos (people.json) est transmise en paramètre.
import MovingPhoto from './MovingPhoto'
import { circlesTrajectory } from '../../utils/circlesTrajectory'

const PEOPLE_SOURCE = 'data/motion/people.json'

export default function PeopleScene() {
  const trajectories = circlesTrajectory()

  return (
    <group>
      {trajectories.map((props, i) => (
        <MovingPhoto key={i} {...props} index={i} source={PEOPLE_SOURCE} />
      ))}
    </group>
  )
}