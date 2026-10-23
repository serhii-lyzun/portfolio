import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useCan3D } from '@/hooks/useCan3D'
import { sceneCursor } from '@/lib/cursor'
import { tour } from '@/lib/tour'
import { cn } from '@/lib/utils'

const Experience = lazy(() => import('@/scene/Experience'))

/** Fade ramp (share of the viewport height) at the edges of the case tour */
const RAMP = 0.35

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

/**
 * The 3D constellation as a fixed full-screen backdrop (plan § 2.2): behind the hero, then
 * beside the case tour, fading out in between and after. Rendering stops while it is invisible.
 * Desktop with mouse + WebGL + motion allowed only; everyone else keeps the ambient glow, and
 * all content stays plain HTML.
 */
export function SceneBackdrop() {
  const can3D = useCan3D()
  const wrap = useRef<HTMLDivElement>(null)
  const pointerActive = useRef(false)
  const labels = useRef<HTMLDivElement>(null!)
  const [running, setRunning] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!can3D) return
    const tourSection = document.getElementById('cases-section')
    const onScroll = () => {
      const vh = window.innerHeight
      const hero = 1 - clamp01(window.scrollY / (vh * 0.85))
      let cases = 0
      if (tourSection && tour.get().enabled) {
        const r = tourSection.getBoundingClientRect()
        cases =
          clamp01((vh * 0.85 - r.top) / (vh * RAMP)) * clamp01((r.bottom - vh * 0.4) / (vh * RAMP))
      }
      const opacity = Math.max(hero, cases)
      if (wrap.current) wrap.current.style.opacity = String(opacity)
      setRunning(opacity > 0)
      tour.set({ mode: opacity === 0 ? 'off' : cases > hero ? 'cases' : 'hero' })
    }
    const onMove = () => (pointerActive.current = true)
    const onLeave = () => {
      pointerActive.current = false
      sceneCursor.set(null)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const unsubscribe = tour.subscribe(onScroll)
    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      unsubscribe()
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [can3D])

  if (!can3D) return null
  const root = document.getElementById('root')
  if (!root) return null

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          ready ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Suspense fallback={null}>
          <Experience
            eventSource={root}
            pointerActive={pointerActive}
            running={running}
            labelLayer={labels}
            onReady={() => setReady(true)}
          />
        </Suspense>
        <div ref={labels} className="absolute inset-0 overflow-hidden" />
      </div>
      {/* Keeps the hero text and tour cards readable over the scene */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-night-950/90 via-night-950/60 to-transparent" />
    </div>
  )
}
