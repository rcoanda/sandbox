import { useState, useRef, useEffect } from 'react'

function Overlay({ imageSrc, onClose, children }) {
  const [flipped, setFlipped] = useState(false)
  const flipTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      clearTimeout(flipTimerRef.current)
    }
  }, [])

  return (
    <>
      <div
        className={'expanded-inner' + (flipped ? ' flipped' : '')}
        onMouseEnter={() => {
          flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
        }}
        onMouseMove={() => {
          if (flipped) return
          clearTimeout(flipTimerRef.current)
          flipTimerRef.current = setTimeout(() => setFlipped(true), 1000)
        }}
        onMouseLeave={() => {
          clearTimeout(flipTimerRef.current)
          setFlipped(false)
        }}
      >
        <div className="expanded-front">
          <img src={imageSrc} alt="" />
        </div>
        <div className="expanded-back">
          {children}
        </div>
      </div>
      <button className="close-btn" onClick={onClose}>✕</button>
    </>
  )
}

export default Overlay
