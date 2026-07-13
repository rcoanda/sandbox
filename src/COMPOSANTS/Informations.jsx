import { useLocation } from 'react-router-dom'
import { categoryLinks } from './CategoryMenu'
import '../styles/Informations.css'

const pageLabels = Object.values(categoryLinks)
  .flat()
  .reduce((acc, { label, path }) => {
    acc[path] = label
    return acc
  }, {})

const pageDescriptions = {
  '/f0': 'Figure emblématique de la géométrie sacrée, cette forme fondamentale structure l\'espace par ses proportions harmonieuses. Elle illustre la perfection mathématique dans un rendu minimaliste et épuré.',
  '/f2': 'Construction géométrique à deux dimensions explorant les relations entre cercles et polygones. Une étude visuelle des symétries et des motifs répétitifs dans un plan organisé.',
  '/f3': 'Représentation tridimensionnelle d\'une structure fractale simple où les motifs se répètent à différentes échelles. Chaque niveau de zoom révèle des détails aussi complexes que l\'ensemble.',
  '/levitation': 'Objet suspendu dans l\'espace numérique défiant les lois de la gravité. L\'illusion de légèreté est renforcée par un éclairage subtil et des ombres portées minutieuses.',
  '/satelite': 'Corps céleste artificiel en orbite autour d\'un point central de l\'espace. La trajectoire circulaire et la rotation créent un ballet mécanique hypnotique et continu.',
  '/oscillation': 'Mouvement de balancier perpétuel capturé dans une boucle visuelle sans fin. Les allers-retours réguliers génèrent une sensation de rythme propice à la méditation.',
  '/anneaux': 'Cercles concentriques tournoyant dans l\'espace à des vitesses différentes. Leurs interactions produisent des motifs moirés et des illusions de profondeur fascinantes.',
  '/huit': 'Courbe en forme de huit tracée par un point en mouvement permanent. Cette figure symbolique de l\'infini explore le passage continu entre deux pôles opposés.',
  '/ellipse': 'Orbite elliptique parcourue par un point focal dans un plan défini. Les deux foyers de l\'ellipse créent une tension visuelle entre attraction et répulsion.',
  '/lemniscate': 'Courbe en forme de ruban infini analogue au symbole de l\'infini en trois dimensions. Ses boucles entrelacées suggèrent un mouvement perpétuel gracieux et enveloppant.',
  '/lissajous': 'Figures de Lissajous générées par deux oscillations sinusoïdales perpendiculaires combinées. Les paramètres variables produisent des motifs complexes, variés et souvent surprenants.',
  '/spirale': 'Courbe qui s\'éloigne progressivement de son centre en tournant régulièrement. La croissance du rayon illustre les concepts mathématiques de progression et d\'expansion géométrique.',
  '/hypocycloide': 'Courbe tracée par un point fixé sur un cercle roulant à l\'intérieur d\'un cercle plus grand. Les dents et boucles créent des motifs étoilés d\'une grande beauté.',
  '/epicycloide': 'Courbe produite par un point situé sur un cercle roulant à l\'extérieur d\'un cercle fixe. Les pétales obtenus varient en nombre selon le rapport des rayons.',
  '/sinusoide': 'Onde sinusoïdale pure se propageant dans l\'espace et le temps de façon continue. Cette fonction mathématique fondamentale illustre les phénomènes périodiques naturels les plus courants.',
  '/bezier': 'Courbe de Bézier définie par des points de contrôle influençant sa forme finale. Outil essentiel en conception graphique et en animation vectorielle pour des tracés fluides.',
  '/random': 'Trajectoire aléatoire générée par des déplacements successifs totalement imprévisibles. Chaque chemin est unique et explore le chaos apparent dans un cadre maîtrisé.',
  '/ruban': 'Surface continue qui se tord et se retourne sur elle-même dans l\'espace virtuel. La bande enroulée évoque les rubans de Möbius et les surfaces non orientables.',
  '/terrelune': 'Notre planète bleue accompagnée de son satellite naturel dans l\'immensité noire du cosmos. Les textures réalistes et l\'éclairage solaire restituent la beauté de ce duo céleste.',
  '/moon': 'Satellite naturel de la Terre dont la surface cratérisée est reproduite avec fidélité. Les phases lunaires défilent au rythme d\'une rotation lente et apaisante.',
  '/astronaute': 'Figure humaine flottant dans le vide spatial reliée à son vaisseau par un cordon. Le costume blanc immaculé contraste avec l\'obscurité infinie de l\'espace.',
  '/k2d': 'Composition abstraite en deux dimensions jouant sur les formes géométriques et les couleurs. Les éléments s\'assemblent et se désassemblent dans une danse visuelle captivante.',
  '/k3d': 'Installation abstraite tridimensionnelle où les volumes et les transparences s\'entremêlent harmonieusement. La caméra tourne autour de la structure pour en révéler toutes les facettes.',
  '/reseaux': 'Ensemble de nœuds interconnectés formant un maillage complexe et hiérarchisé dans l\'espace. Chaque connexion représente un lien entre les éléments d\'un système distribué.',
  '/grid2d': 'Grille bidimensionnelle dont chaque cellule réagit à des stimuli extérieurs programmés. Les motifs émergents illustrent la complexité issue de règles locales pourtant très simples.',
  '/grid3d': 'Structure tridimensionnelle composée de cellules cubiques animées par un souffle numérique. Les déformations et ondulations parcourent le volume telle une onde dans un cristal.',
  '/matrice': 'Tableau multidimensionnel de points lumineux dont l\'intensité varie dans le temps réel. Les données abstraites deviennent une expérience visuelle immersive, dynamique et changeante.',
  '/cube': 'Solide géométrique parfait tournant sur ses axes dans l\'espace tridimensionnel. Les arêtes et faces semi-transparentes révèlent la structure interne du volume en mouvement.',
  '/sfere': 'Sphère lisse et parfaite dont la surface réfléchit l\'environnement numérique avec précision. Les courbures et les reflets déforment la perception de l\'espace environnant.',
  '/terre': 'Photographies satellite de notre planète capturées depuis l\'espace par les agences spatiales. Chaque image révèle la beauté et la fragilité des paysages terrestres variés.',
  '/metropolitan': 'Chefs-d\'œuvre du Metropolitan Museum of Art de New York présentés dans une galerie virtuelle. Les œuvres traversent les époques et les civilisations avec une élégance intemporelle.',
  '/europe': 'Collections des plus grands musées européens réunies dans un espace de contemplation commun. La diversité artistique du continent s\'exprime à travers des siècles de créativité.',
  '/cleveland': 'Trésors du Cleveland Museum of Art exposés dans une interface interactive et moderne. La richesse des collections asiatiques et contemporaines dialogue avec les classiques occidentaux.',
  '/chicago': 'Œuvres emblématiques de l\'Art Institute of Chicago présentées en haute résolution numérique. De l\'impressionnisme à l\'art moderne, chaque tableau raconte une histoire visuelle unique.',
  '/cooper': 'Designs du Cooper Hewitt Smithsonian Design Museum de New York soigneusement sélectionnés. Les objets du quotidien deviennent des pièces d\'exception dans ce musée dédié au design.',
  '/aquatique': 'Monde sous-marin reconstitué où la faune et la flore marines sont magnifiées numériquement. Les couleurs vives des récifs coralliens créent un spectacle aquatique enchanteur et coloré.',
}

function Informations() {
  const location = useLocation()
  const label = pageLabels[location.pathname] || ''
  const description = pageDescriptions[location.pathname] || ''

  return (
    <aside className="informations">
      <div>
        <h1>{label}</h1>
        <p>{description}</p>
      </div>
    </aside>
  )
}

export default Informations
