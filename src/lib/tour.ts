import { useSyncExternalStore } from 'react'
import type { CaseSlug } from '@/content/types'

/**
 * Shared state between the page and the 3D scene (plan § 2.1):
 * - `mode`: where the constellation is shown: behind the hero, beside the case tour, or hidden
 * - `active`: the case whose card is in the middle of the screen during the tour
 * - `enabled`: the desktop 3D tour layout is on (false on phones / no WebGL / reduced motion)
 */
export type TourState = {
  mode: 'hero' | 'cases' | 'off'
  active: CaseSlug | null
  enabled: boolean
}

let state: TourState = { mode: 'hero', active: null, enabled: false }
const listeners = new Set<() => void>()

export const tour = {
  get: () => state,
  set(next: Partial<TourState>) {
    const merged = { ...state, ...next }
    if (
      merged.mode === state.mode &&
      merged.active === state.active &&
      merged.enabled === state.enabled
    )
      return
    state = merged
    listeners.forEach((l) => l())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export const useTour = () => useSyncExternalStore(tour.subscribe, tour.get, tour.get)

/** Scroll the tour to a case card (used when a crystal is clicked behind the hero). */
export function scrollToCase(slug: CaseSlug) {
  const card = document.getElementById(`case-${slug}`)
  if (!card) return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
  return true
}
