import { Routes, Route } from 'react-router-dom'
import { DicoProvider } from './composants/Dico'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Ellipse from './pages/Trajectoires/Ellipse'
import Terre from './pages/GaleriesApi/Terre'
import Archive from './pages/Archive'
import Lemniscate from './pages/Trajectoires/Lemniscate'
import Grid2D from './pages/Structures/Grid2D'
import Grid3D from './pages/Structures/Grid3D'
import Sphere from './pages/Structures/Sphere'
import Anneaux from './pages/3D/Anneaux'
import Oscillation from './pages/3D/Oscillation'
import Levitation from './pages/3D/Levitation'
import Satelite from './pages/3D/Satelite'
import Random from './pages/Trajectoires/Random'
import Lissajous from './pages/Trajectoires/Lissajous'
import Spirale from './pages/Trajectoires/Spirale'
import Hypocycloide from './pages/Trajectoires/Hypocycloide'
import Epicycloide from './pages/Trajectoires/Epicycloide'
import Sinusoide from './pages/Trajectoires/Sinusoide'
import Bezier from './pages/Trajectoires/Bezier'
import Ruban from './pages/Trajectoires/Ruban'
import Huit from './pages/Trajectoires/Huit'
import Circuit2D from './pages/Trajectoires/Circuit2D'
import Circuit3D from './pages/Trajectoires/Circuit3D'
import Reseaux from './pages/Structures/Reseaux'
import Cube from './pages/Structures/Cube'
import Synchro from './pages/Geometrie/Synchro'
import Matrice from './pages/Structures/Matrice'
import Bloc from './pages/Geometrie/Bloc'
import Suite from './pages/Geometrie/Suite'
import Polygone from './pages/Geometrie/Polygone'
import TerreLune from './pages/Cosmos/TerreLune'
import Metropolitan from './pages/GaleriesApi/Metropolitan'
import Europe from './pages/GaleriesApi/Europe'
import Lune from './pages/Cosmos/Lune'
import Astronaute from './pages/Cosmos/Astronaute'
import Abstrait2D from './pages/Abstrait/Abstrait2D'
import Abstrait3D from './pages/Abstrait/Abstrait3D'
import Cleveland from './pages/GaleriesApi/Cleveland'
import Chicago from './pages/GaleriesApi/Chicago'
import Cooper from './pages/GaleriesApi/Cooper'
import Aquatique from './pages/GaleriesApi/Aquatique'
import Parfum from './pages/Design/Parfum'
import Phoenix from './pages/Graphisme/Phoenix'
import Cristal from './pages/Graphisme/Cristal'
import Eau from './pages/Design/Eau'
import Hamburger from './pages/Design/Hamburger'

function App() {
  return (
    <DicoProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/anneaux" element={<Anneaux />} />
        <Route path="/oscillation" element={<Oscillation />} />
        <Route path="/levitation" element={<Levitation />} />
        <Route path="/satelite" element={<Satelite />} />
        <Route path="/huit" element={<Huit />} />
        <Route path="/random" element={<Random />} />
        <Route path="/synchro" element={<Synchro />} />
        <Route path="/matrice" element={<Matrice />} />
        <Route path="/bloc" element={<Bloc />} />
        <Route path="/suite" element={<Suite />} />
        <Route path="/polygone" element={<Polygone />} />
        <Route path="/terre" element={<Terre />} />
        <Route path="/ellipse" element={<Ellipse />} />
        <Route path="/lemniscate" element={<Lemniscate />} />
        <Route path="/lissajous" element={<Lissajous />} />
        <Route path="/spirale" element={<Spirale />} />
        <Route path="/hypocycloide" element={<Hypocycloide />} />
        <Route path="/epicycloide" element={<Epicycloide />} />
        <Route path="/sinusoide" element={<Sinusoide />} />
        <Route path="/bezier" element={<Bezier />} />
        <Route path="/ruban" element={<Ruban />} />
        <Route path="/circuit2d" element={<Circuit2D />} />
        <Route path="/circuit3d" element={<Circuit3D />} />
        <Route path="/reseaux" element={<Reseaux />} />
        <Route path="/cube" element={<Cube />} />
        <Route path="/grid2d" element={<Grid2D />} />
        <Route path="/grid3d" element={<Grid3D />} />
        <Route path="/sfere" element={<Sphere />} />
        <Route path="/terrelune" element={<TerreLune />} />
        <Route path="/metropolitan" element={<Metropolitan />} />
        <Route path="/europe" element={<Europe />} />
        <Route path="/lune" element={<Lune />} />
        <Route path="/astronaute" element={<Astronaute />} />
        <Route path="/abstrait2D" element={<Abstrait2D />} />
        <Route path="/abstrait3D" element={<Abstrait3D />} />
        <Route path="/cleveland" element={<Cleveland />} />
        <Route path="/chicago" element={<Chicago />} />
        <Route path="/cooper" element={<Cooper />} />
        <Route path="/aquatique" element={<Aquatique />} />
        <Route path="/parfum" element={<Parfum />} />
        <Route path="/eau" element={<Eau />} />
        <Route path="/hamburger" element={<Hamburger />} />
        <Route path="/phoenix" element={<Phoenix />} />
        <Route path="/cristal" element={<Cristal />} />
      </Routes>
    </DicoProvider>
  )
}

export default App
