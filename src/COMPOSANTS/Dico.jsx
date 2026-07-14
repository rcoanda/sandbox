import { createContext, useContext, useState, useEffect } from 'react'

const DicoContext = createContext()
const STORAGE_KEY = 'app-lang'

const dict = {
  fr: {
    nav: {
      about: 'A propos',
      contact: 'Contact',
      archive: 'Archive',
    },
    home: {
      categories: {
        geometrie: 'Géométrie',
        '3d': '3D',
        trajectoires: 'Trajectoires',
        cosmos: 'Cosmos',
        abstrait: 'Abstrait',
        structures: 'Structures',
        galeriesApi: 'Galeries API',
      },
      explorer: 'Explorer',
    },
    about: {
      title: 'À propos',
      subtitle: 'AI-Assisted Development',
    },
    contact: {
      title: 'Contact',
      nom: 'Nom :',
      adresse: 'Adresse :',
      telephone: 'Téléphone :',
      email: 'Email :',
      site: 'Site web :',
    },
    archive: {
      title: 'Archive',
      categories: {
        geometrie: 'Géométrie',
        '3d': '3D',
        trajectoires: 'Trajectoires',
        cosmos: 'Cosmos',
        abstrait: 'Abstrait',
        structure: 'Structures',
        galeriesApi: 'Collections & Défilés',
      },
    },
    loading: 'Chargement...',
    menu: {
      '/f0': 'F0',
      '/f2': 'F2',
      '/f3': 'F3',
      '/levitation': 'Lévitation',
      '/satelite': 'Satelite',
      '/oscillation': 'Oscillation',
      '/anneaux': 'Anneaux',
      '/huit': 'Huit',
      '/ellipse': 'Ellipse',
      '/lemniscate': 'Lemniscate',
      '/lissajous': 'Lissajous',
      '/spirale': 'Spirale',
      '/hypocycloide': 'Hypocycloide',
      '/epicycloide': 'Epicycloide',
      '/sinusoide': 'Sinusoide',
      '/bezier': 'Bezier',
      '/random': 'Random',
      '/ruban': 'Ruban',
      '/terrelune': 'Terre',
      '/lune': 'Lune',
      '/astronaute': 'Astronaute',
      '/k2d': 'K2D',
      '/k3d': 'K3D',
      '/reseaux': 'Réseaux',
      '/grid2d': 'Grid2D',
      '/grid3d': 'Grid3D',
      '/matrice': 'Matrice',
      '/cube': 'Cube',
      '/sfere': 'Sphère',
      '/terre': 'Terre',
      '/metropolitan': 'Metropolitan',
      '/europe': 'Europe',
      '/cleveland': 'Cleveland',
      '/chicago': 'Chicago',
      '/cooper': 'Cooper Hewitt',
      '/aquatique': 'Aquatique',
    },
    desc: {
      '/f0': "Figure emblématique de la géométrie sacrée, cette forme fondamentale structure l'espace par ses proportions harmonieuses. Elle illustre la perfection mathématique dans un rendu minimaliste et épuré.",
      '/f2': 'Construction géométrique à deux dimensions explorant les relations entre cercles et polygones. Une étude visuelle des symétries et des motifs répétitifs dans un plan organisé.',
      '/f3': "Représentation tridimensionnelle d'une structure fractale simple où les motifs se répètent à différentes échelles. Chaque niveau de zoom révèle des détails aussi complexes que l'ensemble.",
      '/levitation': "Objet suspendu dans l'espace numérique défiant les lois de la gravité. L'illusion de légèreté est renforcée par un éclairage subtil et des ombres portées minutieuses.",
      '/satelite': "Corps céleste artificiel en orbite autour d'un point central de l'espace. La trajectoire circulaire et la rotation créent un ballet mécanique hypnotique et continu.",
      '/oscillation': 'Mouvement de balancier perpétuel capturé dans une boucle visuelle sans fin. Les allers-retours réguliers génèrent une sensation de rythme propice à la méditation.',
      '/anneaux': "Cercles concentriques tournoyant dans l'espace à des vitesses différentes. Leurs interactions produisent des motifs moirés et des illusions de profondeur fascinantes.",
      '/huit': 'Courbe en forme de huit tracée par un point en mouvement permanent. Cette figure symbolique de l\'infini explore le passage continu entre deux pôles opposés.',
      '/ellipse': 'Orbite elliptique parcourue par un point focal dans un plan défini. Les deux foyers de l\'ellipse créent une tension visuelle entre attraction et répulsion.',
      '/lemniscate': "Courbe en forme de ruban infini analogue au symbole de l'infini en trois dimensions. Ses boucles entrelacées suggèrent un mouvement perpétuel gracieux et enveloppant.",
      '/lissajous': 'Figures de Lissajous générées par deux oscillations sinusoïdales perpendiculaires combinées. Les paramètres variables produisent des motifs complexes, variés et souvent surprenants.',
      '/spirale': "Courbe qui s'éloigne progressivement de son centre en tournant régulièrement. La croissance du rayon illustre les concepts mathématiques de progression et d'expansion géométrique.",
      '/hypocycloide': 'Courbe tracée par un point fixé sur un cercle roulant à l\'intérieur d\'un cercle plus grand. Les dents et boucles créent des motifs étoilés d\'une grande beauté.',
      '/epicycloide': 'Courbe produite par un point situé sur un cercle roulant à l\'extérieur d\'un cercle fixe. Les pétales obtenus varient en nombre selon le rapport des rayons.',
      '/sinusoide': 'Onde sinusoïdale pure se propageant dans l\'espace et le temps de façon continue. Cette fonction mathématique fondamentale illustre les phénomènes périodiques naturels les plus courants.',
      '/bezier': 'Courbe de Bézier définie par des points de contrôle influençant sa forme finale. Outil essentiel en conception graphique et en animation vectorielle pour des tracés fluides.',
      '/random': 'Trajectoire aléatoire générée par des déplacements successifs totalement imprévisibles. Chaque chemin est unique et explore le chaos apparent dans un cadre maîtrisé.',
      '/ruban': "Surface continue qui se tord et se retourne sur elle-même dans l'espace virtuel. La bande enroulée évoque les rubans de Möbius et les surfaces non orientables.",
      '/terrelune': "Notre planète bleue accompagnée de son satellite naturel dans l'immensité noire du cosmos. Les textures réalistes et l'éclairage solaire restituent la beauté de ce duo céleste.",
      '/lune': 'Satellite naturel de la Terre dont la surface cratérisée est reproduite avec fidélité. Les phases lunaires défilent au rythme d\'une rotation lente et apaisante.',
      '/astronaute': 'Figure humaine flottant dans le vide spatial reliée à son vaisseau par un cordon. Le costume blanc immaculé contraste avec l\'obscurité infinie de l\'espace.',
      '/k2d': 'Composition abstraite en deux dimensions jouant sur les formes géométriques et les couleurs. Les éléments s\'assemblent et se désassemblent dans une danse visuelle captivante.',
      '/k3d': 'Installation abstraite tridimensionnelle où les volumes et les transparences s\'entremêlent harmonieusement. La caméra tourne autour de la structure pour en révéler toutes les facettes.',
      '/reseaux': 'Ensemble de nœuds interconnectés formant un maillage complexe et hiérarchisé dans l\'espace. Chaque connexion représente un lien entre les éléments d\'un système distribué.',
      '/grid2d': 'Grille bidimensionnelle dont chaque cellule réagit à des stimuli extérieurs programmés. Les motifs émergents illustrent la complexité issue de règles locales pourtant très simples.',
      '/grid3d': "Structure tridimensionnelle composée de cellules cubiques animées par un souffle numérique. Les déformations et ondulations parcourent le volume telle une onde dans un cristal.",
      '/matrice': 'Tableau multidimensionnel de points lumineux dont l\'intensité varie dans le temps réel. Les données abstraites deviennent une expérience visuelle immersive, dynamique et changeante.',
      '/cube': 'Solide géométrique parfait tournant sur ses axes dans l\'espace tridimensionnel. Les arêtes et faces semi-transparentes révèlent la structure interne du volume en mouvement.',
      '/sfere': 'Sphère lisse et parfaite dont la surface réfléchit l\'environnement numérique avec précision. Les courbures et les reflets déforment la perception de l\'espace environnant.',
      '/terre': 'Photographies satellite de notre planète capturées depuis l\'espace par les agences spatiales. Chaque image révèle la beauté et la fragilité des paysages terrestres variés.',
      '/metropolitan': "Chefs-d'œuvre du Metropolitan Museum of Art de New York présentés dans une galerie virtuelle. Les œuvres traversent les époques et les civilisations avec une élégance intemporelle.",
      '/europe': 'Collections des plus grands musées européens réunies dans un espace de contemplation commun. La diversité artistique du continent s\'exprime à travers des siècles de créativité.',
      '/cleveland': 'Trésors du Cleveland Museum of Art exposés dans une interface interactive et moderne. La richesse des collections asiatiques et contemporaines dialogue avec les classiques occidentaux.',
      '/chicago': "Œuvres emblématiques de l'Art Institute of Chicago présentées en haute résolution numérique. De l'impressionnisme à l'art moderne, chaque tableau raconte une histoire visuelle unique.",
      '/cooper': 'Designs du Cooper Hewitt Smithsonian Design Museum de New York soigneusement sélectionnés. Les objets du quotidien deviennent des pièces d\'exception dans ce musée dédié au design.',
      '/aquatique': 'Monde sous-marin reconstitué où la faune et la flore marines sont magnifiées numériquement. Les couleurs vives des récifs coralliens créent un spectacle aquatique enchanteur et coloré.',
    },
  },
  en: {
    nav: {
      about: 'About',
      contact: 'Contact',
      archive: 'Archive',
    },
    home: {
      categories: {
        geometrie: 'Geometry',
        '3d': '3D',
        trajectoires: 'Trajectories',
        cosmos: 'Cosmos',
        abstrait: 'Abstract',
        structures: 'Structures',
        galeriesApi: 'API Galleries',
      },
      explorer: 'Explore',
    },
    about: {
      title: 'About',
      subtitle: 'AI-Assisted Development',
    },
    contact: {
      title: 'Contact',
      nom: 'Name:',
      adresse: 'Address:',
      telephone: 'Phone:',
      email: 'Email:',
      site: 'Website:',
    },
    archive: {
      title: 'Archive',
      categories: {
        geometrie: 'Geometry',
        '3d': '3D',
        trajectoires: 'Trajectories',
        cosmos: 'Cosmos',
        abstrait: 'Abstract',
        structure: 'Structures',
        galeriesApi: 'Collections & Shows',
      },
    },
    loading: 'Loading...',
    menu: {
      '/f0': 'F0',
      '/f2': 'F2',
      '/f3': 'F3',
      '/levitation': 'Levitation',
      '/satelite': 'Satellite',
      '/oscillation': 'Oscillation',
      '/anneaux': 'Rings',
      '/huit': 'Figure Eight',
      '/ellipse': 'Ellipse',
      '/lemniscate': 'Lemniscate',
      '/lissajous': 'Lissajous',
      '/spirale': 'Spiral',
      '/hypocycloide': 'Hypocycloid',
      '/epicycloide': 'Epicycloid',
      '/sinusoide': 'Sinusoid',
      '/bezier': 'Bezier',
      '/random': 'Random',
      '/ruban': 'Ribbon',
      '/terrelune': 'Earth',
      '/lune': 'Moon',
      '/astronaute': 'Astronaut',
      '/k2d': 'K2D',
      '/k3d': 'K3D',
      '/reseaux': 'Networks',
      '/grid2d': 'Grid2D',
      '/grid3d': 'Grid3D',
      '/matrice': 'Matrix',
      '/cube': 'Cube',
      '/sfere': 'Sphere',
      '/terre': 'Earth',
      '/metropolitan': 'Metropolitan',
      '/europe': 'Europe',
      '/cleveland': 'Cleveland',
      '/chicago': 'Chicago',
      '/cooper': 'Cooper Hewitt',
      '/aquatique': 'Aquatic',
    },
    desc: {
      '/f0': 'An iconic figure of sacred geometry, this fundamental form structures space through its harmonious proportions. It illustrates mathematical perfection in a minimalist and clean rendering.',
      '/f2': 'A two-dimensional geometric construction exploring the relationships between circles and polygons. A visual study of symmetries and repeating patterns on an organized plane.',
      '/f3': 'A three-dimensional representation of a simple fractal structure where patterns repeat at different scales. Each zoom level reveals details as complex as the whole.',
      '/levitation': 'An object suspended in digital space defying the laws of gravity. The illusion of lightness is reinforced by subtle lighting and meticulous drop shadows.',
      '/satelite': 'An artificial celestial body orbiting a central point in space. The circular trajectory and rotation create a hypnotic and continuous mechanical ballet.',
      '/oscillation': 'A perpetual pendulum motion captured in an endless visual loop. The regular back-and-forth generates a sense of rhythm conducive to meditation.',
      '/anneaux': 'Concentric circles spinning in space at different speeds. Their interactions produce moiré patterns and fascinating depth illusions.',
      '/huit': 'A figure-eight curve traced by a point in permanent motion. This symbolic figure of infinity explores the continuous passage between two opposite poles.',
      '/ellipse': 'An elliptical orbit traversed by a focal point in a defined plane. The two foci of the ellipse create a visual tension between attraction and repulsion.',
      '/lemniscate': 'An infinite ribbon-shaped curve analogous to the infinity symbol in three dimensions. Its intertwined loops suggest a graceful and enveloping perpetual motion.',
      '/lissajous': 'Lissajous figures generated by two combined perpendicular sinusoidal oscillations. The variable parameters produce complex, varied and often surprising patterns.',
      '/spirale': 'A curve that gradually moves away from its center while rotating regularly. The growth of the radius illustrates the mathematical concepts of progression and geometric expansion.',
      '/hypocycloide': 'A curve traced by a point fixed on a circle rolling inside a larger circle. The teeth and loops create star-shaped patterns of great beauty.',
      '/epicycloide': 'A curve produced by a point on a circle rolling outside a fixed circle. The resulting petals vary in number according to the ratio of the radii.',
      '/sinusoide': 'A pure sine wave propagating through space and time continuously. This fundamental mathematical function illustrates the most common natural periodic phenomena.',
      '/bezier': 'A Bézier curve defined by control points influencing its final shape. An essential tool in graphic design and vector animation for smooth paths.',
      '/random': 'A random trajectory generated by successive completely unpredictable displacements. Each path is unique and explores apparent chaos within a controlled framework.',
      '/ruban': 'A continuous surface that twists and turns on itself in virtual space. The coiled band evokes Möbius strips and non-orientable surfaces.',
      '/terrelune': 'Our blue planet accompanied by its natural satellite in the black immensity of the cosmos. Realistic textures and solar lighting restore the beauty of this celestial duo.',
      '/lune': "Earth's natural satellite whose cratered surface is faithfully reproduced. The lunar phases scroll at the pace of a slow and soothing rotation.",
      '/astronaute': 'A human figure floating in the void of space connected to their ship by a tether. The immaculate white suit contrasts with the infinite darkness of space.',
      '/k2d': 'An abstract two-dimensional composition playing with geometric shapes and colors. The elements assemble and disassemble in a captivating visual dance.',
      '/k3d': 'An abstract three-dimensional installation where volumes and transparencies intertwine harmoniously. The camera orbits the structure to reveal all its facets.',
      '/reseaux': 'A set of interconnected nodes forming a complex and hierarchical mesh in space. Each connection represents a link between the elements of a distributed system.',
      '/grid2d': 'A two-dimensional grid where each cell reacts to programmed external stimuli. The emerging patterns illustrate the complexity arising from very simple local rules.',
      '/grid3d': 'A three-dimensional structure composed of cubic cells animated by a digital breath. Deformations and undulations travel through the volume like a wave in a crystal.',
      '/matrice': 'A multidimensional array of luminous points whose intensity varies in real time. Abstract data becomes an immersive, dynamic and ever-changing visual experience.',
      '/cube': 'A perfect geometric solid rotating on its axes in three-dimensional space. The semi-transparent edges and faces reveal the internal structure of the moving volume.',
      '/sfere': 'A smooth and perfect sphere whose surface reflects the digital environment with precision. The curvatures and reflections distort the perception of the surrounding space.',
      '/terre': 'Satellite photographs of our planet captured from space by space agencies. Each image reveals the beauty and fragility of diverse terrestrial landscapes.',
      '/metropolitan': "Masterpieces from the Metropolitan Museum of Art in New York presented in a virtual gallery. The works span eras and civilizations with timeless elegance.",
      '/europe': 'Collections from the greatest European museums gathered in a shared contemplative space. The artistic diversity of the continent is expressed through centuries of creativity.',
      '/cleveland': 'Treasures from the Cleveland Museum of Art displayed in an interactive and modern interface. The richness of Asian and contemporary collections dialogues with Western classics.',
      '/chicago': "Iconic works from the Art Institute of Chicago presented in high-resolution digital format. From Impressionism to modern art, each painting tells a unique visual story.",
      '/cooper': 'Carefully selected designs from the Cooper Hewitt Smithsonian Design Museum in New York. Everyday objects become exceptional pieces in this museum dedicated to design.',
      '/aquatique': 'A reconstructed underwater world where marine fauna and flora are digitally magnified. The vibrant colors of coral reefs create an enchanting and colorful aquatic spectacle.',
    },
  },
}

export function DicoProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'fr')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const toggleLang = () => {
    setLang((l) => (l === 'fr' ? 'en' : 'fr'))
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = dict[lang]
    for (const k of keys) {
      if (value == null) return key
      value = value[k]
    }
    return value ?? key
  }

  return (
    <DicoContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </DicoContext.Provider>
  )
}

export function useDico() {
  const ctx = useContext(DicoContext)
  if (!ctx) {
    throw new Error('useDico must be used within a DicoProvider')
  }
  return ctx
}
