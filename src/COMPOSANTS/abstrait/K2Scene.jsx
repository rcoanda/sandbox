import '../../styles/abstrait/K2D.css'

function K2Scene({ transparent }) {
  return (
    <div className="k2d-layout" style={{ background: transparent ? 'transparent' : undefined }}>
      <div className="k2d-container" style={transparent ? { background: 'transparent', border: 'none', boxShadow: 'none' } : undefined}>
        <svg className="k2d-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750">
          <defs>
            <radialGradient id="bg-grad-1" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e3d59" />
              <stop offset="50%" stopColor="#17b978" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#07111e" />
            </radialGradient>
            <linearGradient id="yellow-sun" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffb703" />
              <stop offset="100%" stopColor="#fdffb6" />
            </linearGradient>
            <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" />
            </filter>
          </defs>

          {!transparent && <>
            <rect width="1000" height="750" fill="url(#bg-grad-1)" />
            <circle cx="300" cy="250" r="180" fill="#000814" opacity="0.6" filter="url(#soft-blur)" />
            <circle cx="750" cy="500" r="220" fill="#051c33" opacity="0.8" filter="url(#soft-blur)" />
            <path d="M100,600 Q300,400 600,650 T1000,550 L1000,750 L0,750 Z" fill="#0a2540" opacity="0.4" filter="url(#soft-blur)" />
            <circle cx="200" cy="200" r="90" fill="#e63946" opacity="0.15" filter="url(#soft-blur)" />
            <circle cx="800" cy="250" r="120" fill="#ffb703" opacity="0.12" filter="url(#soft-blur)" />
          </>}

          <polygon className="animated-triangle" points="150,650 450,150 550,550" fill="url(#yellow-sun)" />

          <path d="M 600,200 C 750,220 850,400 700,550 C 650,450 620,300 600,200 Z" fill="#080f1a" stroke="#4cc9f0" strokeWidth="1.5" opacity="0.9" />

          <circle className="animated-ring" cx="500" cy="380" r="170" fill="none" stroke="#4361ee" strokeWidth="4" opacity="0.4" />

          <circle className="animated-disk" cx="480" cy="400" r="140" fill="#4cc9f0" opacity="0.15" />

          <line className="animated-line-1" x1="50" y1="100" x2="850" y2="650" stroke="#000" strokeWidth="3" />

          <line className="animated-line-2" x1="90" y1="550" x2="920" y2="200" stroke="#000" strokeWidth="2" />

          <line x1="500" y1="50" x2="300" y2="700" stroke="#000" strokeWidth="1.5" />

          <path d="M 150,300 Q 400,100 850,350" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
          <path d="M 200,680 Q 600,500 750,100" fill="none" stroke="#ff007f" strokeWidth="1.5" opacity="0.6" />

          <g className="animated-strings" stroke="#fff" strokeWidth="1">
            <line x1="700" y1="550" x2="900" y2="450" />
            <line x1="710" y1="565" x2="910" y2="465" />
            <line x1="720" y1="580" x2="920" y2="480" />
            <line x1="730" y1="595" x2="930" y2="495" />
          </g>

          <g className="animated-grid">
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

          <g className="animated-cosmos">
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
      </div>
    </div>
  )
}

export default K2Scene
