import { useSyncExternalStore } from 'react'

// Basic gate for the WebGL scene. Finer device tiers (GPU, low-power) come in M7 (plan § 4.4).
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

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/** True on desktop-like devices with a mouse, motion allowed and WebGL available. */
export function useCan3D() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches && hasWebGL(),
    () => false,
  )
}
