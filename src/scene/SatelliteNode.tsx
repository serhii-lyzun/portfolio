import { useMemo, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3, type Mesh } from 'three'
import { SATELLITE_DISTANCE, type Satellite } from './layout'
import { useLabelPortal } from './LabelPortal'
import { useScene } from './SceneContext'

/** Small context node (Web App, HERE Maps, npm, …) that follows the node it belongs to. */
export function SatelliteNode({ satellite }: { satellite: Satellite }) {
  const { live, focus: hovered } = useScene()
  const portal = useLabelPortal()
  const mesh = useRef<Mesh>(null!)
  const position = useMemo(() => {
    const v = new Vector3()
    live.set(satellite.id, v)
    return v
  }, [live, satellite.id])
  const outward = useMemo(() => new Vector3(), [])
  const related = hovered === satellite.parent

  useFrame(() => {
    const parent = live.get(satellite.parent)
    if (!parent) return
    if (satellite.offset) {
      position.copy(parent).add(satellite.offset)
    } else {
      // Away from the core, flattened vertically so it stays inside the frame
      outward
        .set(parent.x, parent.y * 0.45, 0)
        .normalize()
        .multiplyScalar(SATELLITE_DISTANCE)
      position.copy(parent).add(outward)
    }
    mesh.current.position.copy(position)
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.09, 12, 12]} />
      <meshBasicMaterial color={related ? '#e8ecf4' : '#9aa5bb'} />
      <Html
        portal={portal}
        center
        position={[0, -0.32, 0]}
        zIndexRange={[20, 0]}
        pointerEvents="none"
      >
        <p
          className="w-max max-w-[6.5rem] text-center text-[11px] leading-tight text-ink-muted transition-opacity duration-300 select-none"
          style={{ opacity: labelOpacity(satellite, hovered, related) }}
        >
          {satellite.label}
        </p>
      </Html>
    </mesh>
  )
}

/**
 * Core satellites (Web App, HERE Maps) are always labelled; a case's satellite (npm, Stripe, …)
 * only while that case is in focus, so labels don't crowd the hero text.
 */
function labelOpacity(satellite: Satellite, focus: string | null, related: boolean) {
  if (satellite.offset) return focus && !related ? 0.3 : 0.8
  return related ? 0.95 : 0
}
