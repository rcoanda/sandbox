import { useEffect } from 'react'

const styleId = 'scene-api-styles'

const animStyles = `
  .sa-code-line { animation: saFade 4s ease-in-out infinite; }
  .sa-code-line:nth-child(2) { animation-delay: 0.3s; }
  .sa-code-line:nth-child(3) { animation-delay: 0.6s; }
  .sa-code-line:nth-child(4) { animation-delay: 0.9s; }
  .sa-code-line:nth-child(5) { animation-delay: 1.2s; }
  .sa-code-line:nth-child(6) { animation-delay: 1.5s; }
  .sa-code-line:nth-child(7) { animation-delay: 1.8s; }
  .sa-code-line:nth-child(8) { animation-delay: 2.1s; }
  .sa-code-line:nth-child(9) { animation-delay: 2.4s; }
  .sa-code-line:nth-child(10) { animation-delay: 2.7s; }
  @keyframes saFade { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
  .sa-cursor { animation: saBlink 0.8s step-end infinite; }
  @keyframes saBlink { 50% { opacity: 0; } }
  .sa-box { animation: saGlow 3s ease-in-out infinite; }
  @keyframes saGlow { 0%,100% { stroke-opacity: 0.5; filter: drop-shadow(0 0 4px rgba(0,153,204,0.3)); } 50% { stroke-opacity: 1; filter: drop-shadow(0 0 12px rgba(0,153,204,0.7)); } }
  .sa-node { animation: saPulse 4s ease-in-out infinite; }
  .sa-node:nth-child(2) { animation-delay: 1s; }
  .sa-node:nth-child(3) { animation-delay: 2s; }
  @keyframes saPulse { 0%,100% { opacity: 0.3; r: 3; } 50% { opacity: 1; r: 5; } }
  .sa-flow { stroke-dasharray: 6 4; animation: saDash 2s linear infinite; }
  @keyframes saDash { 100% { stroke-dashoffset: -40; } }
  .sa-data-dot { animation: saDataMove 3s ease-in-out infinite; }
  @keyframes saDataMove { 0%,100% { opacity: 0; transform: translateX(0); } 50% { opacity: 1; transform: translateX(20px); } }
  .sa-particle { animation: saDrift 8s ease-in-out infinite; }
  .sa-particle:nth-child(2) { animation-delay: 2s; }
  .sa-particle:nth-child(3) { animation-delay: 4s; }
  @keyframes saDrift { 0%,100% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.6; transform: translateY(-30px); } }
`

function ApiScene({ transparent }) {
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
    <svg viewBox="0 0 800 420" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
      {!transparent && <rect width="100%" height="100%" fill="#0a0f14" />}

      <text x="24" y="32" fontFamily="'Courier New', monospace" fontSize="11" fill="#00ff66">
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#1a1a1a">// api-gateway.js</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#00ff66">import {'{'} Router {'}'} from 'express';</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#00ff66">import {'{'} authenticate {'}'} from './middleware';</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#000000">{''}</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#ffcc00">const</tspan>
        <tspan className="sa-code-line" x="84" dy="1.4em" fill="#00ff66">router = Router();</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#000000">{''}</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#ff1a8c">router.get</tspan>
        <tspan className="sa-code-line" x="140" dy="1.4em" fill="#ff9900">('/api/data',</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#000000">  authenticate, async (req, res) {'=>'} {'{'}</tspan>
        <tspan className="sa-code-line" x="36" dy="1.4em" fill="#ffcc00">const</tspan>
        <tspan className="sa-code-line" x="102" dy="1.4em" fill="#00ff66">result = </tspan>
        <tspan className="sa-code-line" x="210" dy="1.4em" fill="#ff1a8c">await</tspan>
        <tspan className="sa-code-line" x="270" dy="1.4em" fill="#ff9900">fetchData</tspan>
        <tspan className="sa-code-line" x="330" dy="1.4em" fill="#ff9900">();</tspan>
        <tspan className="sa-code-line" x="36" dy="1.4em" fill="#ff1a8c">res.json</tspan>
        <tspan className="sa-code-line" x="120" dy="1.4em" fill="#ff9900">(result);</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#000000">{'}'});</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#000000">{''}</tspan>
        <tspan className="sa-code-line" x="24" dy="1.4em" fill="#ffcc00">export</tspan>
        <tspan className="sa-code-line" x="84" dy="1.4em" fill="#ffcc00">default</tspan>
        <tspan className="sa-code-line" x="156" dy="1.4em" fill="#00ff66">router;</tspan>
        <tspan x="24" dy="1.4em" fill="#00ff66" className="sa-cursor">█</tspan>
      </text>

      <g transform="translate(430, 60)">
        <rect className="sa-box" x="0" y="0" width="310" height="180" rx="14" stroke="#0099cc" strokeWidth="2" fill="rgba(0,153,204,0.2)" />

        <line x1="0" y1="44" x2="310" y2="44" stroke="#0099cc" strokeWidth="1" opacity="0.7" />

        <circle cx="18" cy="22" r="5" fill="#ff3b30" />
        <circle cx="36" cy="22" r="5" fill="#ff9500" />
        <circle cx="54" cy="22" r="5" fill="#34c759" />

        <text x="155" y="27" fontFamily="Arial, sans-serif" fontSize="11" fill="#2d2d2d" textAnchor="middle">api-gateway:3000</text>

        <rect x="20" y="68" width="120" height="40" rx="6" stroke="#0099cc" strokeWidth="1.5" fill="rgba(0,153,204,0.3)" />
        <text x="80" y="93" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="13" fill="#0099cc" textAnchor="middle">/api/data</text>

        <rect x="170" y="68" width="120" height="40" rx="6" stroke="#0099cc" strokeWidth="1.5" fill="rgba(0,153,204,0.3)" />
        <text x="230" y="93" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="13" fill="#0099cc" textAnchor="middle">middleware</text>

        <rect x="20" y="126" width="120" height="40" rx="6" stroke="#0099cc" strokeWidth="1.5" fill="rgba(0,153,204,0.3)" />
        <text x="80" y="151" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="13" fill="#0099cc" textAnchor="middle">controller</text>

        <rect x="170" y="126" width="120" height="40" rx="6" stroke="#0099cc" strokeWidth="1.5" fill="rgba(0,153,204,0.3)" />
        <text x="230" y="151" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="13" fill="#0099cc" textAnchor="middle">service</text>

        <line className="sa-flow" x1="140" y1="88" x2="168" y2="88" stroke="#0099cc" strokeWidth="1.5" />
        <line className="sa-flow" x1="80" y1="108" x2="80" y2="126" stroke="#0099cc" strokeWidth="1.5" />
        <line className="sa-flow" x1="230" y1="108" x2="230" y2="126" stroke="#0099cc" strokeWidth="1.5" />
        <line x1="140" y1="146" x2="168" y2="146" stroke="#0099cc" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3" />
      </g>

      <g transform="translate(530, 260)">
        <rect x="0" y="0" width="110" height="44" rx="8" stroke="#0099cc" strokeWidth="1.5" fill="rgba(0,153,204,0.25)" />
        <text x="55" y="27" fontFamily="Arial, sans-serif" fontSize="10" fill="#007399" textAnchor="middle">database</text>
      </g>

      <line className="sa-flow" x1="585" y1="240" x2="585" y2="260" stroke="#0099cc" strokeWidth="1.5" />

      <g transform="translate(450, 280)">
        <circle className="sa-node" cx="0" cy="0" r="4" fill="#0099cc" />
        <circle className="sa-node" cx="140" cy="0" r="4" fill="#0099cc" />
        <circle className="sa-node" cx="70" cy="-20" r="4" fill="#0099cc" />
      </g>

      <g transform="translate(430, 310)">
        <circle className="sa-particle" cx="30" cy="0" r="3" fill="#00e63a" />
        <circle className="sa-particle" cx="80" cy="0" r="2.5" fill="#0099cc" />
        <circle className="sa-particle" cx="130" cy="0" r="3" fill="#ff4da6" />
      </g>

    </svg>
  )
}

export default ApiScene
