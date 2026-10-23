import type { ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  /** Numbered eyebrow, Carl Gordon-style section index (plan § 1.3) */
  index: string
  title: string
  children?: ReactNode
  className?: string
}

export function SectionHeading({ id, index, title, children, className }: Props) {
  const ref = useReveal<HTMLElement>()
  return (
    <header ref={ref} className={cn('mb-10 max-w-3xl sm:mb-14', className)}>
      <p className="font-display text-sm tracking-[0.3em] text-cyan uppercase">
        <span className="text-ink-muted">{index} /</span> {title}
      </p>
      <h2 id={id} className="mt-3 font-display text-3xl leading-tight font-bold sm:text-5xl">
        {title}
      </h2>
      {children && <div className="mt-4 text-lg leading-relaxed text-ink-muted">{children}</div>}
    </header>
  )
}
