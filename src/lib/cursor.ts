/**
 * Label for the custom cursor pill, set by the 3D scene while a crystal or a
 * screenshot card is hovered. DOM targets are detected by the cursor itself.
 */
let label: string | null = null
const listeners = new Set<() => void>()

export const sceneCursor = {
  get: () => label,
  set(next: string | null) {
    if (next === label) return
    label = next
    listeners.forEach((l) => l())
    // Keep the native cursor in sync for users without the custom cursor
    document.body.style.cursor = next === null ? '' : next === 'Zoom' ? 'zoom-in' : 'pointer'
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

/** Fine pointer + motion allowed: the custom cursor, magnetic buttons and trail run. */
export const FANCY_POINTER = '(pointer: fine) and (prefers-reduced-motion: no-preference)'
