import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Overlay from './Overlay'

function OverlayGrid({ isOpen, imageSrc, onClose, originRect, children }) {
  const expandedRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !originRect) return
    const targetEl = expandedRef.current
    if (!targetEl) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const targetW = vw * 0.8
    const targetH = vh * 0.8

    gsap.set(targetEl, {
      position: 'fixed',
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      margin: 0,
      borderRadius: '6px',
      zIndex: 100,
    })

    gsap.to(targetEl, {
      top: (vh - targetH) / 2,
      left: (vw - targetW) / 2,
      width: targetW,
      height: targetH,
      borderRadius: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [isOpen])

  const handleClose = () => {
    const targetEl = expandedRef.current
    if (!targetEl) {
      onClose()
      return
    }

    gsap.to(targetEl, {
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      borderRadius: '6px',
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => onClose(),
    })
  }

  if (!isOpen) return null

  return (
    <div ref={expandedRef} className="expanded-rect">
      <Overlay imageSrc={imageSrc} onClose={handleClose}>
        {children}
      </Overlay>
    </div>
  )
}

export default OverlayGrid
