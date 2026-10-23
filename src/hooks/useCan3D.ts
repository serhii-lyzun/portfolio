import { useSyncExternalStore } from 'react'

// Gate for the WebGL scene (plan § 4.4). Device tiers inside the scene (bloom, resolution) are
// handled by Experience; this decides whether 3D runs at all.
const QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)'

let webgl: boolean | undefined
function hasWebGL() {
  if (webgl === undefined) {
    try {
      const canvas = document.createElement('canvas')
      webgl = !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
    } catch {
      webgl = false
    }
  }
  return webgl
}

/** `?3d=off` forces the 2D site (tests, or a manual escape hatch) */
const forcedOff = () => new URLSearchParams(window.location.search).get('3d') === 'off'

/** Set at runtime when the scene can't keep up or the GPU drops the WebGL context */
let disabledReason: string | null = null
const listeners = new Set<() => void>()

/** Switch the whole site to the 2D layout (static map, case grid). */
export function disable3D(reason: 'performance' | 'context-lost') {
  if (disabledReason) return
  disabledReason = reason
  console.info(`[portfolio] 3D scene disabled: ${reason}`)
  listeners.forEach((l) => l())
}

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  listeners.add(onChange)
  return () => {
    mq.removeEventListener('change', onChange)
    listeners.delete(onChange)
  }
}

/** True on desktop-like devices with a mouse, motion allowed, WebGL available and working. */
export function useCan3D() {
  return useSyncExternalStore(
    subscribe,
    () => !disabledReason && !forcedOff() && window.matchMedia(QUERY).matches && hasWebGL(),
    () => false,
  )
}
