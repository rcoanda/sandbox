export const portfolios = [
  {
    id: 'netflix',
    name: 'Netflix',
    url: 'https://www.netflix.com',
    accent: '#e50914',
  },
  {
    id: 'prime',
    name: 'Prime Video',
    url: 'https://www.primevideo.com',
    accent: '#00a8e1',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    url: 'https://www.amazon.com',
    accent: '#ff9900',
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    accent: '#6e40c9',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    url: 'https://vercel.com',
    accent: '#ffffff',
  },
  {
    id: 'canalplus',
    name: 'Canal+',
    url: 'https://www.canalplus.com',
    accent: '#ff5f00',
  },
  {
    id: 'metropolitan',
    name: 'Metropolitan Museum',
    url: 'https://www.metmuseum.org',
    accent: '#b7712d',
  },
  {
    id: 'nasa',
    name: 'NASA',
    url: 'https://www.nasa.gov',
    accent: '#0b3d91',
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com',
    accent: '#4285f4',
  },
]

export function reelCode(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h.toString(36).padStart(4, '0').slice(0, 4)
}