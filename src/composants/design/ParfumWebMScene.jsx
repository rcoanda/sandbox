import { useRef } from 'react'
import parfumVideo from '/assets/design/parfum.webm'

function ParfumWebMScene() {
  const videoRef = useRef(null)

  return (
    <video
      ref={videoRef}
      src={parfumVideo}
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  )
}

export default ParfumWebMScene