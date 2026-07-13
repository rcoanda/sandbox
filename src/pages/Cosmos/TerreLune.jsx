import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BackArrow from '../../composants/BackArrow'
import CategoryMenu from '../../composants/CategoryMenu'
import Informations from '../../composants/Informations'
import TerreLuneScene from '../../composants/cosmos/TerreLuneScene'
import '../../styles/cosmos/TerreLune.css'

function TerreLune() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return
      setPos({
        x: posStart.current.x + (e.clientX - dragStart.current.x),
        y: posStart.current.y + (e.clientY - dragStart.current.y),
      })
    }

    const handleMouseUp = () => {
      isDragging.current = false
      setDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e) => {
    isDragging.current = true
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { x: pos.x, y: pos.y }
  }

  const sceneOffset = { x: pos.x / 120, y: pos.y / -120 }

  return (
    <div className="sphere-page">
      <BackArrow />
      <Informations />
      <CategoryMenu category="cosmos" />
      <div className="sphere-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <color attach="background" args={['#050510']} />
          <fog attach="fog" args={['#050510', 30, 100]} />
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            minDistance={3}
            maxDistance={20}
          />
          <group position={[sceneOffset.x, sceneOffset.y, 0]}>
            <TerreLuneScene />
          </group>
        </Canvas>
      </div>
      <div
        className={`sphere-handle${dragging ? ' sphere-handle--dragging' : ''}`}
        style={{ transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

export default TerreLune
