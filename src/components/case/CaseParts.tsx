import { Lock } from 'lucide-react'
import type { CaseStudy, ScreenshotMedia } from '@/content/types'
import { cn, domainOf } from '@/lib/utils'
import { CardStack } from '../CardStack'
import { DiagramView } from '../DiagramView'
import { caseIcons, linkIcons } from '../iconMaps'
import { LinkButton } from '../LinkButton'

/** Screenshots → card stack + lightbox; no screenshots → animated diagram. */
export function CaseMedia({
  item,
  sizes,
  className,
}: {
  item: CaseStudy
  sizes?: string
  className?: string
}) {
  const screenshots = item.media.filter((m): m is ScreenshotMedia => m.kind === 'screenshot')
  if (screenshots.length > 0)
    return <CardStack images={screenshots} title={item.title} sizes={sizes} className={className} />

  return (
    <>
      {item.media.map((m, i) =>
        m.kind === 'diagram' ? (
          <DiagramView key={i} diagram={m} color={item.node.color} className={className} />
        ) : null,
      )}
    </>
  )
}

/** every live link is a pill with its domain, opening in a new tab. */
export function CaseLinks({ item, className }: { item: CaseStudy; className?: string }) {
  if (item.links.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {item.links.map((link, i) => {
        const Icon = linkIcons[link.kind]
        return (
          <li key={link.href}>
            <LinkButton
              href={link.href}
              external
              variant={i === 0 ? 'primary' : 'outline'}
              magnetic
              icon={<Icon className="size-4" aria-hidden />}
              hint={domainOf(link.href)}
            >
              {link.label}
            </LinkButton>
          </li>
        )
      })}
    </ul>
  )
}

/** My part in the case, kept apart from the team's result */
export function CaseContribution({ item, className }: { item: CaseStudy; className?: string }) {
  return (
    <div
      className={cn('rounded-xl border-l-2 bg-night-950/40 py-3 pr-4 pl-4', className)}
      style={{ borderColor: item.node.color }}
    >
      <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
        My contribution
      </p>
      <p className="mt-1 text-sm leading-relaxed">{item.contribution}</p>
      <p className="mt-1 text-xs text-ink-muted">Team: {item.team}</p>
    </div>
  )
}

export function CaseMetrics({ item, className }: { item: CaseStudy; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
      {item.metrics.map((m) => (
        // Label is the <dt> for screen readers; visually the value sits on top
        <div
          key={m.label}
          className="flex flex-col-reverse justify-end rounded-xl border border-ink/10 bg-night-950/40 p-3"
        >
          <dt className="mt-1 text-xs leading-snug text-ink-muted">{m.label}</dt>
          <dd
            className="font-display text-xl font-bold sm:text-2xl"
            style={{ color: item.node.color }}
          >
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function StackChips({ stack, className }: { stack: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Tech stack">
      {stack.map((tech) => (
        <li key={tech} className="rounded-full bg-night-800 px-3 py-1 text-xs text-ink-muted">
          {tech}
        </li>
      ))}
    </ul>
  )
}

export function CaseIcon({ item, className }: { item: CaseStudy; className?: string }) {
  const Icon = caseIcons[item.slug]
  return (
    <span
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-xl',
        className,
      )}
      style={{ backgroundColor: `${item.node.color}1f`, color: item.node.color }}
      aria-hidden
    >
      <Icon className="size-5" />
    </span>
  )
}

export function NdaBadge({ note }: { note?: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-xs text-ink-muted">
      <Lock className="size-3.5" aria-hidden />
      {note ?? 'Under NDA'}
    </p>
  )
}
