import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Nasa from './pages/Collections/Nasa'
import Infini from './pages/Motion/Infini'
import Grid from './pages/Structure/Grid'
import Satelite from './pages/3D/Satelite'
import Random from './pages/Motion/Random'
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
        <Route path="/infini" element={<Infini />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/cosmos" element={<Cosmos />} />
        <Route path="/metropolitan" element={<Metropolitan />} />
        <Route path="/europe" element={<Europe />} />
        <Route path="/moon" element={<Moon />} />
        <Route path="/astronaute" element={<Astronaute />} />
        <Route path="/k2d" element={<K2D />} />
        <Route path="/k3d" element={<K3D />} />
        <Route path="/cleveland" element={<Cleveland />} />
      </Routes>
    </div>
  )
}

export default App
