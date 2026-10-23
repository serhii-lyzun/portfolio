import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Props = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms for items revealed together */
  delay?: number
  as?: 'div' | 'li'
}

/** Wrapper that fades its content up when it first scrolls into view. */
export function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const ref = useReveal<HTMLDivElement & HTMLLIElement>()
  const Tag = as
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
