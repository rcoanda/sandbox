import { useState, useEffect } from 'react'
import { frameText } from './portfoliosCommon'
import { assetUrlAvailable } from '../../config/PortfoliosConfig'

/* Contenu commun d'un "petit écran" film, utilisé par Expo2D (DOM) et
   Expo3D (fallback quand la vidéo manque, via Html de drei). */

function Film2DScreen({ site, index, total, lang }) {
  const meta = frameText(site, index, total, lang)
  const [imgReady, setImgReady] = useState(false)

  useEffect(() => {
    let alive = true
    assetUrlAvailable(site.img).then((ok) => {
      if (alive) setImgReady(ok)
    })
    return () => { alive = false }
  }, [site.img])

  return (
    <div className="p-frame__body">
      <div className="p-frame__head">
        <span>{meta.headLeft}</span>
        <span>{meta.headRight}</span>
      </div>

      <div className="p-screen">
        {imgReady ? (
          <img className="p-screen__shot" src={site.img} alt={site.name} />
        ) : (
          <div
            className="p-screen__grad"
            style={{ backgroundImage: `linear-gradient(155deg, ${site.accent} 0%, #050507 150%)` }}
          >
            <span className="p-screen__arrow" aria-hidden="true">▶</span>
            <span className="p-screen__name" style={{ color: site.accent }}>{site.name}</span>
            <span className="p-screen__play">{meta.play}</span>
            <span className="p-screen__url">{meta.screenUrl}</span>
          </div>
        )}
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
  )
}

export default Film2DScreen
