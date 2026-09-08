import { useRef } from 'react'
import capsuleMp4 from '/assets/design/capsule.mp4'
import capsuleWebm from '/assets/design/capsule.webm'

function CapsuleScene() {
  const videoRef = useRef(null)

  return (
    <video
      ref={videoRef}
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
    >
      <source src={capsuleMp4} type="video/mp4" />
      <source src={capsuleWebm} type="video/webm" />
    </video>
  )
}

export default CapsuleScene
