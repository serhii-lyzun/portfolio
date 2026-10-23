import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { FANCY_POINTER, sceneCursor } from '@/lib/cursor'

const TRAIL = 5
/** Max distance (px) a magnetic element leans toward the cursor */
const MAGNET_MAX = 10

const subscribeQuery = (onChange: () => void) => {
  const mq = window.matchMedia(FANCY_POINTER)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const useFancyPointer = () =>
  useSyncExternalStore(
    subscribeQuery,
    () => window.matchMedia(FANCY_POINTER).matches,
    () => false,
  )

/** Cursor label for a page element: what a click will do. */
function labelFor(target: Element | null): string | null {
  const el = target?.closest('[data-cursor], a, button, [role="button"]')
  if (!el) return null
  const explicit = el.getAttribute('data-cursor')
  if (explicit !== null) return explicit
  if (el.matches('a[href^="#/case/"]')) return 'Open case'
  if (el.matches('a[target="_blank"]')) return 'Open ↗'
  if (el.matches('button[aria-label^="Open screenshot"]')) return 'Zoom'
  return '' // interactive, no label: the ring just grows
}

/**
 * Custom cursor: a ring that trails the pointer and morphs into a pill naming the
 * action ("Open case", "Open ↗", "Zoom"), plus a short particle trail. Also drives the magnetic
 * pull of `[data-magnetic]` buttons. The native cursor stays visible. Mouse + motion only.
 */
export function CustomCursor() {
  const enabled = useFancyPointer()
  if (!enabled) return null
  return <CursorLayer />
}

function CursorLayer() {
  const ring = useRef<HTMLDivElement>(null)
  const trail = useRef<(HTMLSpanElement | null)[]>([])
  const [domLabel, setDomLabel] = useState<string | null>(null)
  const sceneLabel = useSyncExternalStore(sceneCursor.subscribe, sceneCursor.get, sceneCursor.get)
  const [visible, setVisible] = useState(false)
  const label = domLabel ?? sceneLabel

  useEffect(() => {
    const mouse = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    const dots = Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }))
    let magnet: HTMLElement | null = null
    let frame = 0

    const releaseMagnet = () => {
      if (magnet) magnet.style.translate = ''
      magnet = null
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      mouse.x = e.clientX
      mouse.y = e.clientY
      setVisible(true)

      // Magnetic buttons lean toward the cursor while it is over them
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-magnetic]')
      if (target !== magnet) releaseMagnet()
      if (target) {
        magnet = target
        const r = target.getBoundingClientRect()
        const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAGNET_MAX
        const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAGNET_MAX * 0.6
        target.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`
      }
    }
    const onOver = (e: PointerEvent) => setDomLabel(labelFor(e.target as Element | null))
    const onLeave = () => {
      setVisible(false)
      releaseMagnet()
    }

    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.22
      ringPos.y += (mouse.y - ringPos.y) * 0.22
      if (ring.current)
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      let lead = mouse
      dots.forEach((dot, i) => {
        dot.x += (lead.x - dot.x) * 0.35
        dot.y += (lead.y - dot.y) * 0.35
        const el = trail.current[i]
        if (el) el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`
        lead = dot
      })
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      releaseMagnet()
    }
  }, [])

  const pill = label !== null && label !== ''

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {Array.from({ length: TRAIL }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            trail.current[i] = el
          }}
          className="absolute top-0 left-0 -mt-[2px] -ml-[2px] size-1 rounded-full bg-cyan"
          style={{ opacity: 0.45 - i * 0.08 }}
        />
      ))}
      <div ref={ring} className="absolute top-0 left-0">
        <div
          className={
            pill
              ? 'ml-4 mt-4 w-max rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-night-950 shadow-lg shadow-black/40 transition-all duration-200'
              : `-mt-[17px] -ml-[17px] size-[34px] rounded-full border transition-all duration-200 ${
                  label === '' ? 'scale-150 border-cyan bg-cyan/10' : 'border-ink/40'
                }`
          }
        >
          {pill && label}
        </div>
      </div>
    </div>
  )
}
