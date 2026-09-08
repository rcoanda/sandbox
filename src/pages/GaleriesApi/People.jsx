import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import PeopleScene from '../../canvas/galeriesApi/PeopleScene'
import Informations from '../../composants/globals/Informations'
import '../../styles/galeriesApi/People.css'

function People() {
  return (
    <div className="people-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      <Canvas camera={{ position: [0, 5, 7], fov: 50, up: [0, 1, 0] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <PeopleScene />
      </Canvas>
    </div>
  )
}

export default People