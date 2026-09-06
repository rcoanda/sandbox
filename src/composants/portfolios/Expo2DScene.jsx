import { useDico } from '../../composants/globals/Dico'
import { portfolios } from '../../config/PortfoliosConfig'
import { frameText } from './portfoliosCommon'

function Expo2DScene() {
  const { lang } = useDico()
  const total = portfolios.length

  return (
    <div className="p-stage">
      <section className="p-reel">
        {portfolios.map((site, i) => {
          const meta = frameText(site, i, total, lang)
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
              <div className="p-frame__body">
                <div className="p-frame__head">
                  <span>{meta.headLeft}</span>
                  <span>{meta.headRight}</span>
                </div>

                <div
                  className="p-screen"
                  style={{ backgroundImage: `linear-gradient(155deg, ${site.accent} 0%, #050507 150%)` }}
                >
                  <span className="p-screen__arrow" aria-hidden="true">▶</span>
                  <span className="p-screen__name" style={{ color: site.accent }}>{site.name}</span>
                  <span className="p-screen__play">{meta.play}</span>
                  <span className="p-screen__url">{meta.screenUrl}</span>
                </div>

                <div className="p-frame__caption">
                  <span className="p-frame__name">{site.name}</span>
                  <span className="p-frame__reel">{meta.reel}</span>
                </div>

                <div className="p-frame__edge">
                  <span className="p-smpte" aria-hidden="true" />
                  <span>{meta.edge}</span>
                </div>
              </div>
              <div className="p-perf p-perf--right" aria-hidden="true" />
            </a>
          )
        })}
      </section>
    </div>
  )
}

export default Expo2DScene