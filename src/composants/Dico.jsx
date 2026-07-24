import { createContext, useContext, useState, useEffect } from 'react'

const DicoContext = createContext()
const STORAGE_KEY = 'app-lang'
//doublon de secours
const fallback = {
  fr: {
    nav: { about: 'A propos', contact: 'Contact', archive: 'Archive' },
    categories: { geometrie: 'Géométrie', '3d': '3D', trajectoires: 'Trajectoires', cosmos: 'Cosmos', abstrait: 'Abstrait', structures: 'Structures', galeriesApi: 'Galeries API' },
    loading: 'Chargement...',
    loadingError: "L'API ne répond pas. Réitérez votre demande.",
    subtitle: { geometrie: 'Formes et figures', '3d': 'Volume et relief', trajectoires: 'Chemins et courbes', cosmos: 'Étoiles et planètes', abstrait: 'Couleurs et formes', structures: 'Nœuds et liens', galeriesApi: 'Images et données' },
  },
  en: {
    nav: { about: 'About', contact: 'Contact', archive: 'Archive' },
    categories: { geometrie: 'Geometry', '3d': '3D', trajectoires: 'Trajectories', cosmos: 'Cosmos', abstrait: 'Abstract', structures: 'Structures', galeriesApi: 'API Galleries' },
    loading: 'Loading...',
    loadingError: 'API is not responding. Retry your request.',
    subtitle: { geometrie: 'Shapes & figures', '3d': 'Volume & depth', trajectoires: 'Paths & curves', cosmos: 'Stars & planets', abstrait: 'Colors & forms', structures: 'Nodes & links', galeriesApi: 'Images & data' },
  },
}

// Mappe une clé de page (ex: "synchro", "levitation") vers le chemin du fichier JSON
// dans /lang/{lang}/pages/ (ex: "geometrie/synchro" → pages/geometrie/synchro.json)
// Utilisé par usePageDico pour charger les traductions spécifiques à chaque page
export const pageToPath = {
  home: 'home',
  about: 'about',
  contact: 'contact',
  archive: 'archive',
  synchro: 'geometrie/synchro',
  bloc: 'geometrie/bloc',
  suite: 'geometrie/suite',
  levitation: '3d/levitation',
  satelite: '3d/satelite',
  oscillation: '3d/oscillation',
  anneaux: '3d/anneaux',
  huit: 'trajectoires/huit',
  ellipse: 'trajectoires/ellipse',
  lemniscate: 'trajectoires/lemniscate',
  lissajous: 'trajectoires/lissajous',
  spirale: 'trajectoires/spirale',
  hypocycloide: 'trajectoires/hypocycloide',
  epicycloide: 'trajectoires/epicycloide',
  sinusoide: 'trajectoires/sinusoide',
  bezier: 'trajectoires/bezier',
  random: 'trajectoires/random',
  ruban: 'trajectoires/ruban',
  terrelune: 'cosmos/terrelune',
  lune: 'cosmos/lune',
  astronaute: 'cosmos/astronaute',
  abstrait2D: 'abstrait/abstrait2D',
  abstrait3D: 'abstrait/abstrait3D',
  reseaux: 'structures/reseaux',
  grid2d: 'structures/grid2d',
  grid3d: 'structures/grid3d',
  matrice: 'structures/matrice',
  cube: 'structures/cube',
  sfere: 'structures/sfere',
  terre: 'galeriesApi/terre',
  metropolitan: 'galeriesApi/metropolitan',
  europe: 'galeriesApi/europe',
  cleveland: 'galeriesApi/cleveland',
  chicago: 'galeriesApi/chicago',
  cooper: 'galeriesApi/cooper',
  aquatique: 'galeriesApi/aquatique',
}

export function DicoProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'fr')
  const [common, setCommon] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}lang/${lang}/pages/home.json`)
      .then((r) => r.json())
      .then(setCommon)
      .catch(() => setCommon(null))
  }, [lang])

  const toggleLang = () => {
    setLang((l) => (l === 'fr' ? 'en' : 'fr'))
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = common
    for (const k of keys) {
      if (value == null) break
      value = value[k]
    }
    if (value != null) return value
    value = fallback[lang]
    for (const k of keys) {
      if (value == null) return key
      value = value[k]
    }
    return value ?? key
  }

  return (
    <DicoContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </DicoContext.Provider>
  )
}

export function useDico() {
  const ctx = useContext(DicoContext)
  if (!ctx) {
    throw new Error('useDico must be used within a DicoProvider')
  }
  return ctx
}

export default function usePageDico(pageKey) {
  const { lang } = useDico()
  const [dico, setDico] = useState(null)

  useEffect(() => {
    if (!pageKey) {
      setDico(null)
      return
    }
    const path = pageToPath[pageKey] || pageKey
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}lang/${lang}/pages/${path}.json`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setDico(data)
      })
      .catch(() => {
        if (!cancelled) setDico(null)
      })
    return () => { cancelled = true }
  }, [lang, pageKey])

  return dico
}
