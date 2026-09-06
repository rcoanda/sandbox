import { useRef, useEffect } from 'react'
import BackArrow from '../../composants/globals/BackArrow'
import CategoryMenu from '../../composants/globals/CategoryMenu'
import Informations from '../../composants/globals/Informations'
import Expo2DScene from '../../composants/portfolios/Expo2DScene'
import '../../styles/portfolios/Expo2D.css'

function Expo2D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      el.scrollLeft += e.deltaY + e.deltaX
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(1200px 640px at 50% -10%, #2a1416 0%, #141013 42%, #08080a 100%)',
        color: '#eee',
        padding: '30px 24px',
      }}
    >
      <BackArrow />
      <Informations />
      <CategoryMenu category="portfolios" />
      <Expo2DScene />
    </div>
  )
}

export default Expo2D