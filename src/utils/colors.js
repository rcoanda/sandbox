const HUE_RANGE = 360
const SATURATION_MIN = 60
const SATURATION_MAX = 85
const LIGHTNESS_MIN = 45
const LIGHTNESS_MAX = 65

export function randomColor() {
  const hue = Math.floor(Math.random() * HUE_RANGE)
  const saturation = SATURATION_MIN + Math.floor(Math.random() * (SATURATION_MAX - SATURATION_MIN))
  const lightness = LIGHTNESS_MIN + Math.floor(Math.random() * (LIGHTNESS_MAX - LIGHTNESS_MIN))
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
