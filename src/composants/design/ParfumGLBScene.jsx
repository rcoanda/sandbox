import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import parfumGltf from '/assets/design/parfum.glb?url'
import {
  ROTATION_SPEED,
  applyDissolveToObject,
  phaseParams,
  useParfumTiming,
} from './parfumCommon'

function ParfumGLBScene() {
  const groupRef = useRef()
  const { scene } = useGLTF(parfumGltf)
  const { getT, groupProps } = useParfumTiming()
  const uniformsRef = useRef({ uDissolve: { value: 0 } })

  useEffect(() => {
    applyDissolveToObject(scene, uniformsRef.current)
  }, [scene])

  useFrame(({ clock }) => {
    const t = getT(clock.getElapsedTime())
    const { s } = phaseParams(t)

    uniformsRef.current.uDissolve.value = s

    if (groupRef.current) {
      groupRef.current.rotation.y = t * ROTATION_SPEED
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 4]} intensity={1.6} />
      <directionalLight position={[-4, -3, -2]} intensity={0.5} color="#a5d6ff" />
      <group ref={groupRef} {...groupProps}>
        <primitive object={scene} />
      </group>
    </>
  )
}

export default ParfumGLBScene