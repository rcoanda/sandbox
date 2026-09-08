// Génère la liste des trajectoires circulaires (rayon, vitesse, direction, phase,
// dimensions) pour la scène Circles et la galerie People.
const TRAJECTORIES = [
  { radius: 1.6, speed: 0.9, direction: 1, count: 12, length: 0.22, width: 0.15 },
  { radius: 3.4, speed: 0.6, direction: -1, count: 26, length: 0.5, width: 0.35 },
  { radius: 5.4, speed: 0.4, direction: 1, count: 40, length: 0.7, width: 0.5 },
]

export function circlesTrajectory() {
  const rects = []
  for (const t of TRAJECTORIES) {
    for (let i = 0; i < t.count; i++) {
      rects.push({
        radius: t.radius,
        speed: t.speed,
        direction: t.direction,
        phase: (i / t.count) * Math.PI * 2,
        length: t.length,
        width: t.width,
      })
    }
  }
  return rects
}
