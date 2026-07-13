import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Grid3DScene from '../../composants/structures/Grid3DScene'
import '../../styles/structures/Grid3D.css'
import Informations from '../../composants/Informations'

const ROWS = 8
const COLS = 14
const SPACING = 1.05
const OFFSET_X = ((COLS - 1) * SPACING) / 2
const OFFSET_Z = ((ROWS - 1) * SPACING) / 2

function Grid3D() {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const cubes = useMemo(() => {
    const result = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        result.push({
          position: [c * SPACING - OFFSET_X, 0, r * SPACING - OFFSET_Z],
          hue: Math.random() * 360,
        })
      }
    }
    return result
  }, [])

  const handleCubeClick = useCallback((index) => {
    setSelectedIndex((prev) => prev === index ? null : index)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedIndex !== null) setSelectedIndex(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  return (
    <div className="grid-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="structure" />
      <Canvas camera={{ position: [0, 12, 12], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1} />
        <directionalLight position={[-10, 5, -10]} intensity={0.3} />
        <Grid3DScene
          cubes={cubes}
          selectedIndex={selectedIndex}
          onCubeClick={handleCubeClick}
        />
      </Canvas>
      {selectedIndex !== null && (
        <button className="close-btn" onClick={() => setSelectedIndex(null)}
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 200 }}
        >✕</button>
      )}
    </div>
  )
}

export default Grid3D
