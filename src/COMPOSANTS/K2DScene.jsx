import { useEffect } from 'react'

const styleId = 'scene-abstrait-styles'

const animStyles = `
  .sa-triangle { transform-origin: 380px 450px; opacity: 0.75; animation: saFloat 6s ease-in-out infinite; }
  @keyframes saFloat { 0%,100% { transform: translateY(0); opacity: 0.75; } 50% { transform: translateY(-20px); opacity: 0.95; } }
  .sa-ring { transform-origin: 500px 380px; animation: saRotCW 25s linear infinite; }
  @keyframes saRotCW { 100% { transform: rotate(360deg); } }
  .sa-disk { transform-origin: 480px 400px; animation: saRotCCW 20s linear infinite, saPulse 8s ease-in-out infinite; }
  @keyframes saRotCCW { 100% { transform: rotate(-360deg); } }
  @keyframes saPulse { 0%,100% { opacity: 0.15; } 50% { opacity: 0.35; } }
  .sa-line1 { transform-origin: 450px 375px; animation: saVib1 7s ease-in-out infinite; }
  @keyframes saVib1 { 50% { transform: rotate(1.5deg); } }
  .sa-line2 { transform-origin: 505px 375px; animation: saVib2 9s ease-in-out infinite; }
  @keyframes saVib2 { 50% { transform: rotate(-1.2deg); } }
  .sa-grid { transform-origin: 650px 220px; animation: saSwing 12s ease-in-out infinite; }
  @keyframes saSwing { 0%,100% { transform: rotate(15deg); } 50% { transform: rotate(22deg); } }
  .sa-cosmos { transform-origin: 350px 250px; animation: saCos 8s ease-in-out infinite; }
  @keyframes saCos { 50% { transform: translate(-10px, 15px); } }
  .sa-strings { transform-origin: 815px 522px; animation: saStr 5s ease-in-out infinite; }
  @keyframes saStr { 50% { transform: scaleY(1.05) skewX(1deg); opacity: 0.6; } }
`

function SceneAbstrait() {
  useEffect(() => {
    if (!document.getElementById(styleId)) {
      const el = document.createElement('style')
      el.id = styleId
      el.textContent = animStyles
      document.head.appendChild(el)
    }
    return () => {
      const el = document.getElementById(styleId)
      if (el) el.remove()
    }
  }, [])

  return (
    <svg viewBox="0 0 1000 750" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="sa-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb703" />
          <stop offset="100%" stopColor="#fdffb6" />
        </linearGradient>
      </defs>
      <polygon className="sa-triangle" points="150,650 450,150 550,550" fill="url(#sa-yellow)" />
      <path d="M 600,200 C 750,220 850,400 700,550 C 650,450 620,300 600,200 Z" fill="#080f1a" stroke="#4cc9f0" strokeWidth="1.5" opacity="0.9" />
      <circle className="sa-ring" cx="500" cy="380" r="170" fill="none" stroke="#4361ee" strokeWidth="4" opacity="0.4" />
      <circle className="sa-disk" cx="480" cy="400" r="140" fill="#4cc9f0" opacity="0.15" />
      <line className="sa-line1" x1="50" y1="100" x2="850" y2="650" stroke="#000" strokeWidth="3" />
      <line className="sa-line2" x1="90" y1="550" x2="920" y2="200" stroke="#000" strokeWidth="2" />
      <line x1="500" y1="50" x2="300" y2="700" stroke="#000" strokeWidth="1.5" />
      <path d="M 150,300 Q 400,100 850,350" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
      <path d="M 200,680 Q 600,500 750,100" fill="none" stroke="#ff007f" strokeWidth="1.5" opacity="0.6" />
      <g className="sa-strings" stroke="#fff" strokeWidth="1">
        <line x1="700" y1="550" x2="900" y2="450" />
        <line x1="710" y1="565" x2="910" y2="465" />
        <line x1="720" y1="580" x2="920" y2="480" />
        <line x1="730" y1="595" x2="930" y2="495" />
      </g>
      <g className="sa-grid">
        <rect x="0" y="0" width="80" height="80" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
        <line x1="20" y1="0" x2="20" y2="80" stroke="#fff" strokeWidth="1" opacity="0.7" />
        <line x1="40" y1="0" x2="40" y2="80" stroke="#fff" strokeWidth="1" opacity="0.7" />
        <line x1="60" y1="0" x2="60" y2="80" stroke="#fff" strokeWidth="1" opacity="0.7" />
        <line x1="0" y1="20" x2="80" y2="20" stroke="#fff" strokeWidth="1" opacity="0.7" />
        <line x1="0" y1="40" x2="80" y2="40" stroke="#fff" strokeWidth="1" opacity="0.7" />
        <line x1="0" y1="60" x2="80" y2="60" stroke="#fff" strokeWidth="1" opacity="0.7" />
        <rect x="20" y="20" width="20" height="20" fill="#e63946" />
        <rect x="40" y="60" width="20" height="20" fill="#ffb703" />
        <rect x="0" y="40" width="20" height="20" fill="#4cc9f0" />
      </g>
      <g className="sa-cosmos">
        <circle cx="350" cy="250" r="40" fill="#f1faee" opacity="0.9" />
        <circle cx="350" cy="250" r="30" fill="#e63946" />
        <circle cx="350" cy="250" r="15" fill="#000" />
        <circle cx="350" cy="250" r="5" fill="#fff" />
        <circle cx="280" cy="200" r="12" fill="#000" />
        <circle cx="250" cy="230" r="8" fill="#4cc9f0" />
        <circle cx="290" cy="160" r="15" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="310" cy="140" r="6" fill="#ffb703" />
      </g>
      <polygon points="780,120 800,160 760,150" fill="#e63946" opacity="0.8" />
      <polygon points="200,450 220,440 210,470" fill="#fff" opacity="0.9" />
      <g stroke="#000" strokeWidth="2">
        <line x1="450" y1="480" x2="480" y2="510" />
        <line x1="460" y1="470" x2="490" y2="500" />
        <line x1="470" y1="460" x2="500" y2="490" />
      </g>
      <path d="M 720,420 Q 750,380 780,410 T 840,430 T 800,480 Z" fill="#fff" opacity="0.15" />
      <path d="M 730,430 Q 750,400 770,420" fill="none" stroke="#000" strokeWidth="1.5" />
      <circle cx="480" cy="220" r="4" fill="#fff" />
      <circle cx="510" cy="205" r="3" fill="#fff" />
      <circle cx="495" cy="240" r="5" fill="#e63946" />
      <circle cx="150" cy="520" r="3" fill="#ffb703" />
      <circle cx="170" cy="545" r="4" fill="#000" />
    </svg>
  )
}

export default SceneAbstrait
