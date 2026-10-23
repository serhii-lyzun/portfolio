import { useLayoutEffect, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Vector3, type Group } from 'three'
import { CORE_ID } from '@/content/ecosystem'
import { glowTexture } from './glowTexture'
import { CORE_COLOR } from './layout'
import { useLabelPortal } from './LabelPortal'
import { useScene } from './SceneContext'

/** The shared Node.js API: every connected case's filament ends here. */
export function CoreNode() {
  const { live, focus: hovered } = useScene()
  const portal = useLabelPortal()
  const inner = useRef<Group>(null!)
  const shell = useRef<Group>(null!)
  useLayoutEffect(() => {
    live.set(CORE_ID, new Vector3(0, 0, 0))
  }, [live])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    inner.current.rotation.set(t * 0.2, t * 0.3, 0)
    shell.current.rotation.set(-t * 0.1, -t * 0.15, 0)
    // Breathe a little faster while any case is hovered: data is flowing
    const pulse = 1 + Math.sin(t * (hovered ? 4 : 1.5)) * 0.04
    shell.current.scale.setScalar(pulse)
  })

  return (
    <group>
      <group ref={inner}>
        <mesh>
          <icosahedronGeometry args={[0.75, 1]} />
          <meshPhysicalMaterial
            color={CORE_COLOR}
            emissive={CORE_COLOR}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.4}
            flatShading
          />
        </mesh>
      </group>
      <group ref={shell}>
        <mesh>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshBasicMaterial color={CORE_COLOR} wireframe transparent opacity={0.25} />
        </mesh>
      </group>
      <sprite scale={6}>
        <spriteMaterial
          map={glowTexture()}
          color={CORE_COLOR}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>
      <Html
        portal={portal}
        center
        position={[0, -1.75, 0]}
        zIndexRange={[20, 0]}
        pointerEvents="none"
      >
        <p className="w-max font-display text-sm font-bold text-cyan select-none [text-shadow:0_1px_8px_#070b14]">
          Node.js API
        </p>
      </Html>
    </group>
  )
}
