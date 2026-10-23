import { createContext, useContext } from 'react'
import type { Ray, Vector3 } from 'three'

export type SceneState = {
  /** Final per-frame positions (group-local), written by nodes, read by filaments/pointer line */
  live: Map<string, Vector3>
  /** Pointer ray in the tilt group's local space; `active` is false when the pointer is outside */
  pointer: { ray: Ray; active: boolean }
  /** Node directly under the cursor (pointer events) */
  hovered: string | null
  setHovered: (id: string | null) => void
  /** Node the scene highlights: hovered, nearest in reach, tour's active case or idle highlight */
  focus: string | null
  /** Node the cursor itself points at (hovered or within reach): drives the pointer line */
  pointed: string | null
}

/** Cursor-to-node distance (world units) at which a case reacts: pull, label, pointer line */
export const REACH = 2.4

export const SceneContext = createContext<SceneState | null>(null)

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used inside <Constellation>')
  return ctx
}

/** Point on the pointer ray at depth `z` (group-local), or null if the ray is parallel. */
export function pointerAtDepth(ray: Ray, z: number, out: Vector3) {
  const dz = ray.direction.z
  if (Math.abs(dz) < 1e-6) return null
  const t = (z - ray.origin.z) / dz
  return out.copy(ray.direction).multiplyScalar(t).add(ray.origin)
}
