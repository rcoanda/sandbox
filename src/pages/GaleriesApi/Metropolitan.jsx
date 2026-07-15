import { useState, useCallback } from 'react'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import MetropolitanLayout from '../../composants/galeriesApi/MetropolitanLayout'
import OverlayGrid from '../../composants/OverlayGrid'
import '../../styles/galeriesApi/Metropolitan.css'
import Informations from '../../composants/Informations'
import Loading from '../../composants/Loading'
import useMetropolitanData from '../../composants/data/MetropolitanData'

function Metropolitan() {
  const { ready, artworks } = useMetropolitanData()
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [originRect, setOriginRect] = useState(null)

  const handleImageClick = useCallback((index, rect) => {
    setExpandedIndex(index)
    setOriginRect(rect)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setOriginRect(null)
  }, [])

  return (
    <div className="metropolitan-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="galeriesApi" />
      {ready ? (
        <MetropolitanLayout
          artworks={artworks}
          ready={ready}
          expandedIndex={expandedIndex}
          onImageClick={handleImageClick}
        />
      ) : (
        <Loading />
      )}
      <OverlayGrid
        isOpen={expandedIndex !== null && artworks[expandedIndex]}
        imageSrc={artworks[expandedIndex]?.imageUrl}
        onClose={handleClose}
        originRect={originRect}
        title={artworks[expandedIndex]?.title}
        author={artworks[expandedIndex]?.artist}
        date={artworks[expandedIndex]?.year}
      />
    </div>
  )
}

export default Metropolitan
