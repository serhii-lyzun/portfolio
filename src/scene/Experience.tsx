import type { ReactNode, RefObject } from 'react'
import { Environment, Lightformer, Stars } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Constellation } from './Constellation'
import { LabelPortalContext } from './LabelPortal'

type Props = {
  /**
   * Element that receives pointer events (the app root). The canvas is fixed at the viewport's
   * top-left, so page (client) coordinates map 1:1 onto it, even over text and buttons.
   */
  eventSource: HTMLElement
  /** Pointer is over the page (tilt / pull / focus only then) */
  pointerActive: RefObject<boolean>
  /** False while the hero is scrolled out of view: stop rendering */
  running: boolean
  /** Layer for the HTML labels, inside the backdrop (see LabelPortal) */
  labelLayer: RefObject<HTMLElement>
  onReady?: () => void
}

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
  return (
    <Canvas
      aria-hidden
      eventSource={eventSource}
      eventPrefix="client"
      camera={{ position: [0, 0.3, 10.5], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={running ? 'always' : 'never'}
      onCreated={() => onReady?.()}
    >
      <fog attach="fog" args={['#070b14', 9, 22]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 8]} intensity={1.2} />

      {/* Studio-style reflections generated on the GPU: no HDR file download */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 4, -6]}
          scale={[10, 2, 1]}
          color="#3fe0e8"
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[-6, -2, 2]}
          scale={[4, 6, 1]}
          color="#ff5a4e"
        />
        <Lightformer form="circle" intensity={1} position={[6, 2, 4]} scale={3} color="#e8ecf4" />
      </Environment>

      <Stars radius={40} depth={30} count={1200} factor={2.5} saturation={0} fade speed={0.4} />
      <LabelPortalContext.Provider value={labelLayer}>
        <HeroPlacement>
          <pointLight position={[0, 0, 0]} intensity={25} distance={12} color="#3fe0e8" />
          <Constellation pointerActive={pointerActive} />
        </HeroPlacement>
      </LabelPortalContext.Provider>
    </Canvas>
  )
}

/**
 * Centres the constellation on the hero portrait (right column) so the filaments pass behind
 * the photo (plan § 4.6), and scales it down on narrower windows so it stays clear of the text.
 */
function HeroPlacement({ children }: { children: ReactNode }) {
  const viewport = useThree((s) => s.viewport)
  const scale = Math.min(0.62, viewport.width / 25)
  return (
    <group position={[viewport.width * 0.215, 0.1, 0]} scale={scale}>
      {children}
    </group>
  )
}
