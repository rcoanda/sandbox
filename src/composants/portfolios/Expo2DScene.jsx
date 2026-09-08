import { useDico } from '../../composants/globals/Dico'
import { usePortfolios } from './portfoliosCommon'
import Film2DScreen from './Film2DScreen'
import '../../styles/portfolios/Expo2D.css'

function Expo2DScene() {
  const { lang } = useDico()
  const portfolios = usePortfolios()
  if (!portfolios) return null
  const total = portfolios.length

  return (
    <div className="p-stage">
      <section className="p-reel">
        {portfolios.map((site, i) => {
          return (
            <a
              key={site.id}
              className="p-frame"
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--accent': site.accent }}
            >
              <div className="p-perf p-perf--left" aria-hidden="true" />
               <Film2DScreen site={site} index={i} total={total} lang={lang} />
              <div className="p-perf p-perf--right" aria-hidden="true" />
            </a>
          )
        })}
      </section>
    </div>
  )
}

export default Expo2DScene