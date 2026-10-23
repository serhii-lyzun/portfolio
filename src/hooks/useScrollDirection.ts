import { useEffect, useState } from 'react'

/** `hidden` while scrolling down past the hero, `scrolled` once the page left the top. */
export function useScrollDirection(threshold = 8) {
  const [state, setState] = useState({ hidden: false, scrolled: false })

  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (Math.abs(y - last) < threshold) return
        setState({ hidden: y > last && y > 160, scrolled: y > 16 })
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [threshold])

  return state
}
