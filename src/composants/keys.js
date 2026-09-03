import SynchroScene from './geometrie/SynchroScene'
import LevitationScene from './3d/LevitationScene'
import HuitScene from './trajectoires/HuitScene'
import TerreLuneScene from './cosmos/TerreLuneScene'
import Abstrait2DScene from './abstrait/Abstrait2DScene'
import ReseauxScene from './structures/ReseauxScene'
import ApiScene from './galeriesApi/ApiScene'
import ParfumScene from './design/ParfumScene'
import PhoenixLabel from './graphisme/PhoenixLabel'

export const categories = [
  {
    id: 'geometrie',
    label: '01',
    routes: ['/synchro', '/bloc', '/suite', '/polygone'],
    Scene: SynchroScene,
    bgClass: 'home-cell--geometrie',
    is2D: true,
  },
  {
    id: '3d',
    label: '02',
    routes: ['/levitation', '/satelite', '/oscillation', '/anneaux'],
    Scene: LevitationScene,
    bgClass: 'home-cell--3d',
  },
  {
    id: 'trajectoires',
    label: '03',
    routes: ['/huit', '/ellipse', '/lemniscate', '/lissajous', '/spirale', '/hypocycloide', '/epicycloide', '/sinusoide', '/bezier', '/random', '/ruban', '/circuit2d', '/circuit3d'],
    Scene: HuitScene,
    bgClass: 'home-cell--trajectoires',
  },
  {
    id: 'cosmos',
    label: '04',
    routes: ['/terrelune', '/lune', '/astronaute'],
    Scene: TerreLuneScene,
    bgClass: 'home-cell--cosmos',
  },
  {
    id: 'abstrait',
    label: '05',
    routes: ['/abstrait2D', '/abstrait3D'],
    Scene: Abstrait2DScene,
    bgClass: 'home-cell--abstrait',
    is2D: true,
    transparent: true,
  },
  {
    id: 'structures',
    label: '06',
    routes: ['/reseaux', '/grid2d', '/grid3d', '/matrice', '/cube', '/sfere'],
    Scene: ReseauxScene,
    bgClass: 'home-cell--structures',
  },
  {
    id: 'galeriesApi',
    label: '07',
    routes: ['/terre', '/metropolitan', '/europe', '/cleveland', '/chicago', '/cooper', '/aquatique'],
    Scene: ApiScene,
    bgClass: 'home-cell--galeriesApi',
    is2D: true,
    transparent: true,
  },
  {
    id: 'graphisme',
    label: '08',
    routes: ['/phoenix', '/cristal'],
    Scene: PhoenixLabel,
    bgClass: 'home-cell--graphisme',
    is2D: true,
    transparent: true,
  },
  {
    id: 'design',
    label: '09',
    routes: ['/parfum', '/eau', '/hamburger'],
    Scene: ParfumScene,
    bgClass: 'home-cell--design',
  },
  {
    id: 'portfolios',
    label: '10',
    routes: [],
    bgClass: 'home-cell--portfolios',
  },
]

export const navigation = [
  { id: 'about', route: '/about' },
  { id: 'contact', route: '/contact' },
  { id: 'archive', route: '/archive' },
]

export const categoryLinks = Object.fromEntries(
  categories.map((c) => [c.id, c.routes])
)

export const defaultRoute = Object.fromEntries(
  categories.map((c) => [c.id, c.routes[0]])
)

export const pageToPath = {}
pageToPath.home = 'home'
for (const page of navigation) {
  pageToPath[page.id] = page.id
}
for (const cat of categories) {
  for (const route of cat.routes) {
    const key = route.replace('/', '')
    pageToPath[key] = `${cat.id}/${key}`
  }
}

export const fallback = {
  fr: {
    nav: Object.fromEntries(navigation.map((p) => [p.id, p.id])),
    categories: Object.fromEntries(categories.map((c) => [c.id, c.id])),
    loading: 'Chargement...',
    loadingError: "L'API ne répond pas. Réitérez votre demande.",
    subtitle: Object.fromEntries(categories.map((c) => [c.id, ''])),
  },
  en: {
    nav: { about: 'About', contact: 'Contact', archive: 'Archive' },
    categories: Object.fromEntries(categories.map((c) => [c.id, c.id])),
    loading: 'Loading...',
    loadingError: 'API is not responding. Retry your request.',
    subtitle: Object.fromEntries(categories.map((c) => [c.id, ''])),
  },
}