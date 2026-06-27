import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

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
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App
