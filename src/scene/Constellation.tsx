import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { Matrix4, Ray, Vector3, type Group } from 'three'
import { cases, getCase } from '@/content/cases'
import type { DiagramMedia } from '@/content/types'
import { tour, useTour } from '@/lib/tour'
import { CaseNode } from './CaseNode'
import { CoreNode } from './CoreNode'
import { Filament } from './Filament'
import { edges, satellites } from './layout'
import { MiniDiagram3D } from './MiniDiagram3D'
import { PointerLine } from './PointerLine'
import { SatelliteNode } from './SatelliteNode'
import { pointerAtDepth, REACH, SceneContext, type SceneState } from './SceneContext'
import { ScreenshotOrbit } from './ScreenshotOrbit'

/** Max tilt toward the cursor in radians (≈ 8°, plan § 8: keep it calm) */
const TILT_Y = 0.14
const TILT_X = 0.09
/** Horizontal centre of the constellation as a share of the visible width */
const HERO_X = 0.215 // on the portrait (hero right column)
const TOUR_X = 0.24 // in the empty right column of the case tour
/** Zoom on the active case during the tour, relative to the overview */
const FOCUS_ZOOM = 1.75
/** Idle highlight (plan § 2.1): start after this long without pointer movement, then step */
const IDLE_MS = 4000
const IDLE_STEP_MS = 2600

type Props = { pointerActive: RefObject<boolean> }

/**
 * Core + case nodes + satellites + filaments. The outer rig places the whole constellation
 * (hero overview, tour overview, or flown in on the active case); the inner group tilts
 * toward the cursor.
 */
export function Constellation({ pointerActive }: Props) {
  const rig = useRef<Group>(null!)
  const group = useRef<Group>(null!)
  const [hovered, setHovered] = useState<string | null>(null)
  const [near, setNear] = useState<string | null>(null)
  const [guided, setGuided] = useState<string | null>(null)
  const nearRef = useRef<string | null>(null)
  const guidedRef = useRef<string | null>(null)
  const lastMove = useRef(0)
  const { mode, active } = useTour()

  const cursor = useMemo(() => new Vector3(), [])
  const rigTarget = useMemo(() => new Vector3(), [])
  const live = useMemo(() => new Map<string, Vector3>(), [])
  const pointer = useMemo(() => ({ ray: new Ray(), active: false }), [])
  const inverse = useMemo(() => new Matrix4(), [])

  useEffect(() => {
    const onMove = () => (lastMove.current = performance.now())
    onMove()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onMove)
    }
  }, [])

  useFrame((state, delta) => {
    const { mode, active } = tour.get()
    const width = state.viewport.width
    const overview = Math.min(0.62, width / 25)

    // Rig: where the constellation sits and how close we are ("camera" fly-to, plan § 2.1)
    const focusNode = mode === 'cases' && active ? live.get(active) : undefined
    let scale = overview
    if (mode === 'hero') {
      rigTarget.set(width * HERO_X, 0.1, 0)
    } else if (focusNode) {
      scale = overview * FOCUS_ZOOM
      rigTarget.set(
        width * TOUR_X - focusNode.x * scale,
        -focusNode.y * scale,
        -focusNode.z * scale,
      )
    } else {
      rigTarget.set(width * TOUR_X, 0, 0)
    }
    easing.damp3(rig.current.position, rigTarget, 0.6, delta)
    easing.damp3(rig.current.scale, scale, 0.6, delta)

    // Tilt toward the cursor
    pointer.active = !!pointerActive.current
    const { x, y } = state.pointer
    easing.dampE(
      group.current.rotation,
      pointer.active ? [-y * TILT_X, x * TILT_Y, 0] : [0, 0, 0],
      0.5,
      delta,
    )

    // Pointer ray in the tilt group's local space (magnetic pull, focus, pointer line)
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

    // Idle guided highlight behind the hero: step through the cases, featured first
    const idle = performance.now() - lastMove.current - IDLE_MS
    const step =
      mode === 'hero' && idle > 0 ? cases[Math.floor(idle / IDLE_STEP_MS) % cases.length] : null
    const nextGuided = step?.slug ?? null
    if (nextGuided !== guidedRef.current) {
      guidedRef.current = nextGuided
      setGuided(nextGuided)
    }
  })

  // Tour: the active case keeps the focus unless another crystal is hovered directly.
  // Hero: hover, then the nearest case in reach, then the idle guided highlight.
  const focus = mode === 'cases' ? (hovered ?? active) : (hovered ?? near ?? guided)
  const pointed = mode === 'cases' ? hovered : (hovered ?? near)
  const scene: SceneState = { live, pointer, hovered, setHovered, focus, pointed }
  const tourCase = mode === 'cases' && active ? getCase(active) : undefined
  const diagram = tourCase?.media.find((m): m is DiagramMedia => m.kind === 'diagram')

  return (
    <SceneContext.Provider value={scene}>
      <group ref={rig}>
        <group ref={group}>
          <pointLight intensity={25} distance={12} color="#3fe0e8" />
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

          {/* Media of the case in focus during the tour (plan § 3) */}
          {tourCase && (
            <Suspense fallback={null}>
              <ScreenshotOrbit key={tourCase.slug} item={tourCase} />
            </Suspense>
          )}
          {tourCase && diagram && (
            <MiniDiagram3D key={tourCase.slug} item={tourCase} diagram={diagram} />
          )}
        </group>
      </group>
    </SceneContext.Provider>
  )
}
