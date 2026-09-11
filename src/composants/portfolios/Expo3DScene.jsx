import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDico } from '../globals/Dico'
import { usePortfolios } from './portfoliosCommon'
import Film3DScreen from './Film3DScreen'

const DOME = 6.6
const KEY_STEP = 0.6

function Expo3DScene() {
  const { lang } = useDico()
  const portfolios = usePortfolios()
  const groupRef = useRef()
  const targetRotation = useRef(0)

  useEffect(() => {
    const onWheel = (e) => {
      targetRotation.current += (e.deltaY + e.deltaX) * 0.0018
    }
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        targetRotation.current += KEY_STEP
      } else if (e.key === 'ArrowLeft') {
        targetRotation.current -= KEY_STEP
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        (targetRotation.current - groupRef.current.rotation.y) * 0.12
    }
    camera.lookAt(0, 0, 0)
  })

  if (!portfolios) return null
  const total = portfolios.length

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[DOME, 32, 20]} />
        <meshBasicMaterial color="#0b0b0f" side={THREE.BackSide} transparent opacity={0.94} />
      </mesh>
      <mesh>
        <sphereGeometry args={[DOME, 24, 16]} />
        <meshBasicMaterial wireframe color="#2a2a34" transparent opacity={0.16} />
      </mesh>
      {portfolios.map((site, i) => (
        <Film3DScreen key={site.id} site={site} index={i} total={total} lang={lang} />
      ))}
    </group>
  )
}

export default Expo3DScene