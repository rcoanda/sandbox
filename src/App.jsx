import { Routes, Route } from 'react-router-dom'
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
import Reseaux from './pages/Structures/Reseaux'
import Cube from './pages/Structures/Cube'
import F0 from './pages/Geometrie/F0'
import Matrice from './pages/Structures/Matrice'
import F2 from './pages/Geometrie/F2'
import F3 from './pages/Geometrie/F3'
import TerreLune from './pages/Cosmos/TerreLune'
import Metropolitan from './pages/GaleriesApi/Metropolitan'
import Europe from './pages/GaleriesApi/Europe'
import Moon from './pages/Cosmos/Moon'
import Astronaute from './pages/Cosmos/Astronaute'
import K2D from './pages/Abstrait/K2D'
import K3D from './pages/Abstrait/K3D'
import Cleveland from './pages/GaleriesApi/Cleveland'
import Chicago from './pages/GaleriesApi/Chicago'
import Cooper from './pages/GaleriesApi/Cooper'
import Aquatique from './pages/GaleriesApi/Aquatique'

function App() {
  return (
    <div>
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
        <Route path="/f0" element={<F0 />} />
        <Route path="/matrice" element={<Matrice />} />
        <Route path="/f2" element={<F2 />} />
        <Route path="/f3" element={<F3 />} />
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
        <Route path="/reseaux" element={<Reseaux />} />
        <Route path="/cube" element={<Cube />} />
        <Route path="/grid2d" element={<Grid2D />} />
        <Route path="/grid3d" element={<Grid3D />} />
        <Route path="/sfere" element={<Sphere />} />
        <Route path="/terrelune" element={<TerreLune />} />
        <Route path="/metropolitan" element={<Metropolitan />} />
        <Route path="/europe" element={<Europe />} />
        <Route path="/moon" element={<Moon />} />
        <Route path="/astronaute" element={<Astronaute />} />
        <Route path="/k2d" element={<K2D />} />
        <Route path="/k3d" element={<K3D />} />
        <Route path="/cleveland" element={<Cleveland />} />
        <Route path="/chicago" element={<Chicago />} />
        <Route path="/cooper" element={<Cooper />} />
        <Route path="/aquatique" element={<Aquatique />} />
      </Routes>
    </div>
  )
}

export default App
