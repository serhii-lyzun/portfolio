import { useEffect, useRef } from 'react'

/**
 * Fade-up on first scroll into view. The hidden state only applies with motion allowed
 * (see `.reveal` in index.css), so reduced-motion users and no-JS readers always see content.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Already on screen at load (prerendered and painted): don't hide it again
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
    el.classList.add('reveal')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-visible')
        io.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
