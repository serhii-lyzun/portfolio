import { useEffect, useRef, useState, type RefObject } from 'react'
import { PerformanceMonitor, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { disable3D } from '@/hooks/useCan3D'
import { BloomPass } from './BloomPass'
import { Constellation } from './Constellation'
import { LabelPortalContext } from './LabelPortal'
import { StudioEnvironment } from './StudioEnvironment'

type Props = {
  /**
   * Element that receives pointer events (the app root). The canvas is fixed at the viewport's
   * top-left, so page (client) coordinates map 1:1 onto it, even over text and buttons.
   */
  eventSource: HTMLElement
  /** Pointer is over the page (tilt / pull / focus only then) */
  pointerActive: RefObject<boolean>
  /** False while neither the hero nor the case tour is on screen: stop rendering */
  running: boolean
  /** Layer for the HTML labels, inside the backdrop (see LabelPortal) */
  labelLayer: RefObject<HTMLElement>
  onReady?: () => void
}

/**
 * Device tiers (plan § 4.4). High: bloom + up to 1.75× pixel ratio. Mid: no bloom, ≤ 1.25×.
 * If the scene still can't keep up, the site falls back to the 2D layout (`disable3D`).
 */
type Tier = 'high' | 'mid'

/** Hardware that may run bloom; PerformanceMonitor still steps it down if frames drop. */
function bloomCapable() {
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return cores >= 8 && memory >= 8
}

/** Everyone starts on mid (fewer shaders to compile on first frame), capable devices step up */
const STEP_UP_MS = 2500

/**
 * The 3D constellation canvas (lazy-loaded chunk, plan § 4.4). Decorative: all of its
 * information is also on the page as HTML, so the canvas is hidden from assistive tech.
 */
export default function Experience({
  eventSource,
  pointerActive,
  running,
  labelLayer,
  onReady,
}: Props) {
  const [tier, setTier] = useState<Tier>('mid')
  const [declined, setDeclined] = useState(false)
  const declines = useRef(0)

  useEffect(() => {
    if (declined || !bloomCapable()) return
    const timer = setTimeout(() => setTier('high'), STEP_UP_MS)
    return () => clearTimeout(timer)
  }, [declined])

  return (
    <Canvas
      aria-hidden
      eventSource={eventSource}
      eventPrefix="client"
      camera={{ position: [0, 0.3, 10.5], fov: 45 }}
      dpr={tier === 'high' ? [1, 1.75] : [1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={running ? 'always' : 'never'}
      onCreated={({ gl }) => {
        // GPU reset / driver crash: switch to the 2D site instead of a frozen canvas
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          disable3D('context-lost')
        })
        onReady?.()
      }}
    >
      {/* Measures real frame rate; steps the tier down when it stays low (needs ~3 s of data) */}
      <PerformanceMonitor
        bounds={(refreshRate) => (refreshRate > 90 ? [50, 90] : [40, 60])}
        flipflops={3}
        onDecline={() => {
          // 1st slowdown: drop bloom / resolution (or stay on mid). 2nd: give up on 3D.
          declines.current += 1
          setDeclined(true)
          setTier('mid')
          if (declines.current >= 2) disable3D('performance')
        }}
        onFallback={() => disable3D('performance')}
      />

      {/* Opaque page-coloured background: post-processing output has no alpha */}
      <color attach="background" args={['#070b14']} />
      <fog attach="fog" args={['#070b14', 9, 22]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 8]} intensity={1.2} />
      <StudioEnvironment />

      <Stars radius={40} depth={30} count={1200} factor={2.5} saturation={0} fade speed={0.4} />
      <LabelPortalContext.Provider value={labelLayer}>
        <Constellation pointerActive={pointerActive} />
      </LabelPortalContext.Provider>

      {tier === 'high' && <BloomPass />}
    </Canvas>
  )
}
