import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { HalfFloatType } from 'three'

/**
 * Soft glow on the brightest parts only: core, focused crystal, packets.
 * Uses `postprocessing` directly: the React wrapper package pulls in unused effects (e.g. N8AO).
 * Mounted on the high device tier only; while mounted it takes over rendering.
 */
export function BloomPass() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const composer = useRef<EffectComposer | null>(null)

  // Create and dispose in the same effect: React StrictMode (dev) mounts, unmounts and mounts
  // again, and a composer built in useMemo would be reused after its disposal (black scene).
  useEffect(() => {
    const c = new EffectComposer(gl, { multisampling: 4, frameBufferType: HalfFloatType })
    c.addPass(new RenderPass(scene, camera))
    c.addPass(
      new EffectPass(
        camera,
        new BloomEffect({
          mipmapBlur: true,
          luminanceThreshold: 0.75,
          luminanceSmoothing: 0.15,
          intensity: 0.55,
        }),
      ),
    )
    composer.current = c
    return () => {
      composer.current = null
      c.dispose()
    }
  }, [gl, scene, camera])

  useEffect(() => composer.current?.setSize(size.width, size.height), [size])

  // Priority 1: R3F skips its own render and lets the composer draw the frame. Until the
  // composer exists, draw the plain scene so there is never an empty frame.
  useFrame((_, delta) => {
    if (composer.current) composer.current.render(delta)
    else gl.render(scene, camera)
  }, 1)
  return null
}
