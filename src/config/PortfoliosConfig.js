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
]

export function reelCode(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h.toString(36).padStart(4, '0').slice(0, 4)
}