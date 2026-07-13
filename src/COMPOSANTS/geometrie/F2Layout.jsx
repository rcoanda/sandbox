import '../../styles/geometrie/F2.css'

function F2Layout() {
  return (
    <div className="f2-layout">
      <svg viewBox="0 0 500 500" className="f2-svg">
        <circle cx="100" cy="100" r="40" fill="#ff6b6b">
          <animateTransform attributeName="transform" type="translate" values="0,0; 50,50; 0,0" dur="4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; 20; 0" dur="4s" repeatCount="indefinite" additive="sum" />
        </circle>
        <rect x="300" y="50" width="80" height="80" fill="#4ecdc4">
          <animateTransform attributeName="transform" type="translate" values="0,0; 50,50; 0,0" dur="4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; 20; 0" dur="4s" repeatCount="indefinite" additive="sum" />
        </rect>
        <polygon points="100,300 150,400 50,400" fill="#ffe66d">
          <animateTransform attributeName="transform" type="translate" values="0,0; 50,50; 0,0" dur="4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; 20; 0" dur="4s" repeatCount="indefinite" additive="sum" />
        </polygon>
        <rect x="350" y="300" width="70" height="70" fill="#1a535c">
          <animateTransform attributeName="transform" type="translate" values="0,0; 50,50; 0,0" dur="4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; 20; 0" dur="4s" repeatCount="indefinite" additive="sum" />
        </rect>
        <ellipse cx="250" cy="250" rx="60" ry="30" fill="#ff9f1c">
          <animateTransform attributeName="transform" type="translate" values="0,0; 50,50; 0,0" dur="4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; 20; 0" dur="4s" repeatCount="indefinite" additive="sum" />
        </ellipse>
      </svg>
    </div>
  )
}

export default F2Layout
