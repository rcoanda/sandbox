import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { fallback, pageToPath } from '../../config/keys'

const DicoContext = createContext()
const STORAGE_KEY = 'app-lang'

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

// eslint-disable-next-line react-refresh/only-export-components
export function useDico() {
  const ctx = useContext(DicoContext)
  if (!ctx) {
    throw new Error('useDico must be used within a DicoProvider')
  }
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export default function usePageDico(pageKey) {
  const { lang } = useDico()
  const [dico, setDico] = useState(null)
  const prevKey = useRef(pageKey)

  useEffect(() => {
    if (prevKey.current !== pageKey) {
      setDico(null)
      prevKey.current = pageKey
    }
    if (!pageKey) return
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
