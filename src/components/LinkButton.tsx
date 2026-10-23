import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-coral text-night-950 hover:bg-coral-soft',
  outline: 'border border-ink/20 text-ink hover:border-cyan hover:text-cyan',
  ghost: 'text-ink-muted hover:text-cyan',
}

type Props = {
  href: string
  children: ReactNode
  icon?: ReactNode
  variant?: Variant
  /** External links open in a new tab and show ↗ (plan § 4.5) */
  external?: boolean
  /** Small grey text after the label, e.g. the link's domain */
  hint?: string
  className?: string
  /** Leans toward the cursor (CustomCursor) */
  magnetic?: boolean
  /** Custom cursor pill text; defaults to "Open ↗" for external links */
  cursor?: string
}

export function LinkButton({
  href,
  children,
  icon,
  variant = 'outline',
  external = false,
  hint,
  className,
  magnetic,
  cursor,
}: Props) {
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      {...(magnetic && { 'data-magnetic': '' })}
      {...(cursor !== undefined && { 'data-cursor': cursor })}
      className={cn(
        'inline-flex min-h-11 max-w-full items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
        variants[variant],
        className,
      )}
    >
      {icon}
      <span>{children}</span>
      {hint && <span className="hidden text-xs font-normal opacity-60 sm:inline">{hint}</span>}
      {external && (
        <>
          <ArrowUpRight className="size-4 shrink-0" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  )
}
