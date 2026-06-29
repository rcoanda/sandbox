import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Animation from './pages/Animation'
import Infini from './pages/Infini'
import Grid from './pages/Grid'
import Satelite from './pages/Satelite'
import Cosmos from './pages/Cosmos'
import Metropolitan from './pages/Metropolitan'
import Chicago from './pages/Chicago'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-4 bg-white shadow p-4 mb-6">
        <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Accueil
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          À propos
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Contact
        </NavLink>
        <NavLink to="/satelite" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Satelite
        </NavLink>
        <NavLink to="/animation" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Animation
        </NavLink>
        <NavLink to="/infini" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Infini
        </NavLink>
        <NavLink to="/grid" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Grid
        </NavLink>
        <NavLink to="/cosmos" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Cosmos
        </NavLink>
        <NavLink to="/metropolitan" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          The Metropolitan Museum of Art
        </NavLink>
        <NavLink to="/chicago" className={({ isActive }) => isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
          Art Institute of Chicago
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/satelite" element={<Satelite />} />
        <Route path="/animation" element={<Animation />} />
        <Route path="/infini" element={<Infini />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/cosmos" element={<Cosmos />} />
        <Route path="/metropolitan" element={<Metropolitan />} />
        <Route path="/chicago" element={<Chicago />} />
      </Routes>
    </div>
  )
}

export default App
