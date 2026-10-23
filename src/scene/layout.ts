import { Vector3 } from 'three'
import { getCase } from '@/content/cases'
import { CORE_ID, coreConnectedCases, ecosystem } from '@/content/ecosystem'
import type { CaseStudy } from '@/content/types'

// Scene layout for the constellation (plan § 2). Everything is in the tilt group's local space.

export const CORE_COLOR = '#3fe0e8'

/**
 * Satellites of the core sit at fixed offsets. Satellites of a case always sit on the outside of
 * that case (pointing away from the core), so they never cross the ring or the core's label.
 */
const CORE_SATELLITE_OFFSETS: Record<string, [number, number, number]> = {
  web: [-2.5, 0.35, -1.6],
  here: [2.5, -0.35, -1.6],
}
/** Distance of a case satellite from its case */
export const SATELLITE_DISTANCE = 1.45

export type Satellite = {
  id: string
  label: string
  parent: string
  /** Fixed offset for core satellites; null = placed radially outside its case */
  offset: Vector3 | null
}

export const satellites: Satellite[] = ecosystem
  .filter((n) => n.kind !== 'core')
  .map((n) => {
    const fixed = CORE_SATELLITE_OFFSETS[n.id]
    return {
      id: n.id,
      label: n.label,
      parent: n.connectsTo[0],
      offset: fixed ? new Vector3(...fixed) : null,
    }
  })

export type Edge = { from: string; to: string; color: string }

/** Same graph as the 2D ecosystem map: cases → core, satellites → their parent. */
export const edges: Edge[] = [
  ...coreConnectedCases.map((slug) => ({
    from: slug,
    to: CORE_ID,
    color: getCase(slug)!.node.color,
  })),
  ...ecosystem.flatMap((n) =>
    n.connectsTo.map((to) => ({ from: n.id, to, color: getCase(to)?.node.color ?? CORE_COLOR })),
  ),
]

/** Ids an edge touches, so a hovered node can light up its own filaments. */
export const edgeTouches = (edge: Edge, id: string | null) =>
  id !== null && (edge.from === id || edge.to === id)

/** How far (rad) a case sways around its home angle */
const SWAY = 0.21

/**
 * Resting position of a case node at time `t` (seconds): its home angle on the tilted ring around
 * the core (or its own anchor), swaying gently, plus a small bob. Nodes never travel around the
 * ring, so the composition stays readable and easy to point at. Deterministic, so every part of
 * the scene can compute it independently.
 */
export function orbitPosition({ node }: CaseStudy, t: number, out: Vector3) {
  const { radius, speed, phase, tilt } = node.orbit
  const a = node.anchor ? phase + t * speed : phase + Math.sin(t * speed + phase) * SWAY
  out.set(Math.cos(a) * radius, Math.sin(a) * radius * tilt, Math.sin(a) * radius * 0.4)
  out.y += Math.sin(t * 0.8 + phase * 3) * 0.15
  if (node.anchor) {
    out.x += node.anchor[0]
    out.y += node.anchor[1]
    out.z += node.anchor[2]
  }
  return out
}
