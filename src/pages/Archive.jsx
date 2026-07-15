import { useState, useEffect } from 'react'
import { categoryLinks } from '../composants/CategoryMenu'
import { pageToPath, useDico } from '../composants/Dico'
import usePageDico from '../composants/Dico'
import BackArrow from '../composants/BackArrow'

const STORAGE_RT = 'archive-revision-technique'
const STORAGE_CP = 'archive-conception'

function loadArray(key) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : []
  } catch {
    return []
  }
}

function saveArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr))
}

function Archive() {
  const { lang } = useDico()
  const dico = usePageDico('archive')
  const [labels, setLabels] = useState({})
  const [catLabels, setCatLabels] = useState({})
  const categories = Object.entries(categoryLinks)

  useEffect(() => {
    const allPaths = categories.flatMap(([, paths]) => paths)
    const routeToFile = (route) => {
      const key = route.replace(/^\//, '')
      return pageToPath[key] || key
    }
    Promise.all(
      allPaths.map((route) =>
        fetch(`/lang/${lang}/pages/${routeToFile(route)}.json`)
          .then((r) => r.json())
          .then((data) => ({ route, title: data.title }))
          .catch(() => ({ route, title: null }))
      )
    ).then((results) => {
      const map = {}
      results.forEach(({ route, title }) => { map[route] = title })
      setLabels(map)
    })

    fetch(`/lang/${lang}/pages/home.json`)
      .then((r) => r.json())
      .then((data) => setCatLabels(data.categories || {}))
      .catch(() => setCatLabels({}))
  }, [lang])

  const revisionTechnique = loadArray(STORAGE_RT)
  const conception = loadArray(STORAGE_CP)

  return (
    <div className="p-8 pt-20">
      <BackArrow />
      <h1 className="text-3xl font-bold mb-6">{dico?.title}</h1>
      <div className="space-y-8 max-w-3xl">
        {categories.map(([key, paths]) => (
          <div key={key}>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              {catLabels?.[key] || key}
            </h2>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-1 items-center text-sm">
              <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">{dico?.columnPage}</span>
              <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">{dico?.columnRevTechnique}</span>
              <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">{dico?.columnConception}</span>
              {paths.map((path) => {
                const rtChecked = revisionTechnique.includes(path)
                const cpChecked = conception.includes(path)
                return (
                  <div key={path} className="contents">
                    <a
                      href={path}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {labels[path] || path.slice(1)}
                    </a>
                    <label className="flex justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={rtChecked}
                        onChange={(e) => {
                          const arr = loadArray(STORAGE_RT)
                          if (e.target.checked) arr.push(path)
                          else {
                            const i = arr.indexOf(path)
                            if (i !== -1) arr.splice(i, 1)
                          }
                          saveArray(STORAGE_RT, arr)
                        }}
                        className="accent-blue-600"
                      />
                    </label>
                    <label className="flex justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={cpChecked}
                        onChange={(e) => {
                          const arr = loadArray(STORAGE_CP)
                          if (e.target.checked) arr.push(path)
                          else {
                            const i = arr.indexOf(path)
                            if (i !== -1) arr.splice(i, 1)
                          }
                          saveArray(STORAGE_CP, arr)
                        }}
                        className="accent-green-600"
                      />
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Archive
