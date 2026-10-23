import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const R = 22
const CIRCUMFERENCE = 2 * Math.PI * R

/**
 * Bottom-right "back to top" button. Appears after the first screen; its ring fills with the
 * scroll progress.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false)
  const ring = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      ring.current?.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE * (1 - progress)))
      setShown(window.scrollY > window.innerHeight * 0.8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <button
      type="button"
      aria-label="Back to top"
      data-cursor="Top"
      data-magnetic
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      onClick={() => {
        // A section anchor would no longer match what's on screen
        if (window.location.hash && !window.location.hash.startsWith('#/case/'))
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        window.scrollTo({ top: 0 })
      }}
      className={cn(
        'group fixed right-4 bottom-4 z-30 inline-flex size-12 items-center justify-center rounded-full border border-ink/15 bg-night-900/80 text-ink backdrop-blur-md transition-[opacity,transform,border-color,color] duration-300 hover:border-cyan hover:text-cyan sm:right-6 sm:bottom-6 motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
        <circle
          ref={ring}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          className="text-cyan"
        />
      </svg>
      <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  )
}
