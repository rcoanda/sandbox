import { useRef } from 'react'
import capsuleVideo from '/assets/design/capsule.webm'

function CapsuleScene() {
  const videoRef = useRef(null)

  return (
    <video
      ref={videoRef}
      src={capsuleVideo}
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

export default CapsuleScene
