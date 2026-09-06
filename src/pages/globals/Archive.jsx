import { useState, useEffect } from 'react'
import { categoryLinks, pageToPath } from '../../config/keys'
import { useDico } from '../../composants/globals/Dico'
import usePageDico from '../../composants/globals/Dico'
import BackArrow from '../../composants/globals/BackArrow'
import { Link } from 'react-router-dom'






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
        fetch(`${import.meta.env.BASE_URL}lang/${lang}/pages/${routeToFile(route)}.json`)
          .then((r) => r.json())
          .then((data) => ({ route, title: data.title }))
          .catch(() => ({ route, title: null }))
      )
    ).then((results) => {
      const map = {}
      results.forEach(({ route, title }) => { map[route] = title })
      setLabels(map)
    })

    fetch(`${import.meta.env.BASE_URL}lang/${lang}/pages/home.json`)
      .then((r) => r.json())
      .then((data) => setCatLabels(data.categories || {}))
      .catch(() => setCatLabels({}))
  }, [lang, categories])



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
            <div className="grid grid-cols-[1fr] gap-x-6 gap-y-1 items-center text-sm">
              <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">{dico?.columnPage}</span>
              {paths.map((path) => {
                return (

                  <div key={path} className="contents">
                    <Link
                      to={path}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {labels[path] || path.slice(1)}
                    </Link>
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
