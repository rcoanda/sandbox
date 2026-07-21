import { createContext, useContext, useState, useEffect } from 'react'

const DicoContext = createContext()
const STORAGE_KEY = 'app-lang'

const fallback = {
  fr: { loading: 'Chargement...', nav: { about: 'A propos', contact: 'Contact', archive: 'Archive' } },
  en: { loading: 'Loading...', nav: { about: 'About', contact: 'Contact', archive: 'Archive' } },
}

// Mappe une clé de page (ex: "f0", "levitation") vers le chemin du fichier JSON
// dans /lang/{lang}/pages/ (ex: "geometrie/f0" → pages/geometrie/f0.json)
// Utilisé par usePageDico pour charger les traductions spécifiques à chaque page
export const pageToPath = {
  home: 'home',
  about: 'about',
  contact: 'contact',
  archive: 'archive',
  f0: 'geometrie/f0',
  f2: 'geometrie/f2',
  f3: 'geometrie/f3',
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
  k2d: 'abstrait/k2d',
  k3d: 'abstrait/k3d',
  k4d: 'abstrait/k4d',
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
    fetch(`/lang/${lang}/pages/home.json`)
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
    fetch(`/lang/${lang}/pages/${path}.json`)
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
