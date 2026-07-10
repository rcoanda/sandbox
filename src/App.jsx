import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Nasa from './pages/Collections/Nasa'
import Lemniscate from './pages/Trajectoires/Lemniscate'
import Grid from './pages/Structures/Grid'
import Sfere from './pages/Structures/Sfere'
import Satelite from './pages/3D/Satelite'
import Random from './pages/Trajectoires/Random'
import Lissajous from './pages/Trajectoires/Lissajous'
import Spirale from './pages/Trajectoires/Spirale'
import Hypocycloide from './pages/Trajectoires/Hypocycloide'
import Epicycloide from './pages/Trajectoires/Epicycloide'
import Sinusoide from './pages/Trajectoires/Sinusoide'
import Bezier from './pages/Trajectoires/Bezier'
import Cube from './pages/Structures/Cube'
import F1 from './pages/Geometrie/F1'
import F2 from './pages/Geometrie/F2'
import F3 from './pages/Geometrie/F3'
import Cosmos from './pages/Cosmos/Cosmos'
import Metropolitan from './pages/Collections/Metropolitan'
import Europe from './pages/Collections/Europe'
import Moon from './pages/Cosmos/Moon'
import Astronaute from './pages/Cosmos/Astronaute'
import K2D from './pages/Abstrait/K2D'
import K3D from './pages/Abstrait/K3D'
import Cleveland from './pages/Collections/Cleveland'
import Chicago from './pages/Collections/Chicago'
import Cooper from './pages/Collections/Cooper'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/satelite" element={<Satelite />} />
        <Route path="/random" element={<Random />} />
        <Route path="/f1" element={<F1 />} />
        <Route path="/f2" element={<F2 />} />
        <Route path="/f3" element={<F3 />} />
        <Route path="/nasa" element={<Nasa />} />
        <Route path="/lemniscate" element={<Lemniscate />} />
        <Route path="/lissajous" element={<Lissajous />} />
        <Route path="/spirale" element={<Spirale />} />
        <Route path="/hypocycloide" element={<Hypocycloide />} />
        <Route path="/epicycloide" element={<Epicycloide />} />
        <Route path="/sinusoide" element={<Sinusoide />} />
        <Route path="/bezier" element={<Bezier />} />
        <Route path="/cube" element={<Cube />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/sfere" element={<Sfere />} />
        <Route path="/cosmos" element={<Cosmos />} />
        <Route path="/metropolitan" element={<Metropolitan />} />
        <Route path="/europe" element={<Europe />} />
        <Route path="/moon" element={<Moon />} />
        <Route path="/astronaute" element={<Astronaute />} />
        <Route path="/k2d" element={<K2D />} />
        <Route path="/k3d" element={<K3D />} />
        <Route path="/cleveland" element={<Cleveland />} />
        <Route path="/chicago" element={<Chicago />} />
        <Route path="/cooper" element={<Cooper />} />
      </Routes>
    </div>
  )
}

export default App
