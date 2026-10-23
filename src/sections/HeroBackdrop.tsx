import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useCan3D } from '@/hooks/useCan3D'
import { cn } from '@/lib/utils'

const Experience = lazy(() => import('@/scene/Experience'))

/**
 * The 3D constellation behind the hero (plan § 2.2): a fixed full-screen canvas that fades out and
 * stops rendering as the hero scrolls away. Desktop with mouse + WebGL + motion allowed only;
 * everyone else keeps the ambient glow, and all content stays plain HTML.
 */
export function HeroBackdrop() {
  const can3D = useCan3D()
  const wrap = useRef<HTMLDivElement>(null)
  const pointerActive = useRef(false)
  const labels = useRef<HTMLDivElement>(null!)
  const [running, setRunning] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!can3D) return
    const onScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.85), 1)
      if (wrap.current) wrap.current.style.opacity = String(1 - progress)
      setRunning(progress < 1)
    }
    const onMove = () => (pointerActive.current = true)
    const onLeave = () => {
      pointerActive.current = false
      document.body.style.cursor = ''
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      window.removeEventListener('scroll', onScroll)
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
      {/* Keeps the hero text readable over the scene */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-night-950/90 via-night-950/60 to-transparent" />
    </div>
  )
}
