import { useMemo, useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { Matrix4, Ray, Vector3, type Group } from 'three'
import { cases } from '@/content/cases'
import { CaseNode } from './CaseNode'
import { CoreNode } from './CoreNode'
import { Filament } from './Filament'
import { edges, satellites } from './layout'
import { PointerLine } from './PointerLine'
import { SatelliteNode } from './SatelliteNode'
import { pointerAtDepth, REACH, SceneContext, type SceneState } from './SceneContext'

/** Max tilt toward the cursor in radians (≈ 8°, plan § 8: keep it calm) */
const TILT_Y = 0.14
const TILT_X = 0.09

type Props = { pointerActive: RefObject<boolean> }

/** Core + case nodes + satellites + filaments, tilting toward the cursor as one group. */
export function Constellation({ pointerActive }: Props) {
  const group = useRef<Group>(null!)
  const [hovered, setHovered] = useState<string | null>(null)
  const [near, setNear] = useState<string | null>(null)
  const nearRef = useRef<string | null>(null)
  const cursor = useMemo(() => new Vector3(), [])
  const live = useMemo(() => new Map<string, Vector3>(), [])
  const pointer = useMemo(() => ({ ray: new Ray(), active: false }), [])
  const inverse = useMemo(() => new Matrix4(), [])

  useFrame((state, delta) => {
    pointer.active = !!pointerActive.current
    const { x, y } = state.pointer
    easing.dampE(
      group.current.rotation,
      pointer.active ? [-y * TILT_X, x * TILT_Y, 0] : [0, 0, 0],
      0.5,
      delta,
    )

    // Pointer ray in the group's local space, used for magnetic pull and the pointer line
    state.raycaster.setFromCamera(state.pointer, state.camera)
    group.current.updateMatrixWorld()
    inverse.copy(group.current.matrixWorld).invert()
    pointer.ray.copy(state.raycaster.ray).applyMatrix4(inverse)

    // Nearest case within reach of the cursor (React state only changes when it changes)
    let nearest: string | null = null
    let best = REACH
    if (pointer.active) {
      for (const item of cases) {
        const p = live.get(item.slug)
        if (!p || !pointerAtDepth(pointer.ray, p.z, cursor)) continue
        const d = Math.hypot(cursor.x - p.x, cursor.y - p.y)
        if (d < best) {
          best = d
          nearest = item.slug
        }
      }
    }
    if (nearest !== nearRef.current) {
      nearRef.current = nearest
      setNear(nearest)
    }
  })

  const scene: SceneState = { live, pointer, hovered, setHovered, focus: hovered ?? near }

  return (
    <SceneContext.Provider value={scene}>
      <group ref={group}>
        <CoreNode />
        {cases.map((item) => (
          <CaseNode key={item.slug} item={item} />
        ))}
        {satellites.map((s) => (
          <SatelliteNode key={s.id} satellite={s} />
        ))}
        {edges.map((edge) => (
          <Filament key={`${edge.from}-${edge.to}`} edge={edge} />
        ))}
        <PointerLine />
      </group>
    </SceneContext.Provider>
  )
}
