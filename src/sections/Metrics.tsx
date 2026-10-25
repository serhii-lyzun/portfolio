import { CountUp } from '@/components/CountUp'
import { profile } from '@/content/profile'
import type { Metric } from '@/content/types'
import { cn } from '@/lib/utils'

/**
 * Impact numbers in four groups (scope, business outcomes, engineering outcomes, a delivery
 * example). Each number says where it comes from; numbers count up when they scroll into view.
 */
export function Metrics() {
  return (
    <section
      aria-label="Impact in numbers"
      className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-2"
    >
      {profile.metrics.map((group) => (
        <section
          key={group.title}
          aria-label={group.title}
          className="flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-ink/10"
        >
          <h2 className="bg-night-900 px-4 pt-5 sm:px-6 text-xs font-semibold tracking-wider text-ink-muted uppercase">
            {group.title}
            {group.qualifier && (
              <span className="ml-2 font-normal tracking-normal normal-case">
                ({group.qualifier})
              </span>
            )}
          </h2>
          <dl
            className={cn(
              'grid flex-1 gap-px',
              group.metrics.length > 1 && 'grid-cols-2',
              group.metrics.length === 3 && 'sm:grid-cols-3',
            )}
          >
            {group.metrics.map((m, i) => (
              <MetricTile
                key={m.label}
                metric={m}
                // On phones a third tile takes the full row instead of sitting alone
                className={i === 2 ? 'col-span-2 sm:col-span-1' : undefined}
              />
            ))}
          </dl>
        </section>
      ))}
    </section>
  )
}

function MetricTile({ metric: m, className }: { metric: Metric; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse justify-end bg-night-900 px-4 pt-3 pb-6 sm:px-6',
        className,
      )}
    >
      <dt className="mt-2 text-sm leading-snug">
        {m.label}
        {m.note && <span className="mt-1 block text-xs text-ink-muted">{m.note}</span>}
      </dt>
      <dd
        className={cn(
          'font-display font-bold text-ink',
          // Words ("Fewer hires") are smaller than numbers so they fit a third of the group
          typeof m.value === 'string' && m.value.length > 5
            ? 'text-2xl sm:text-3xl'
            : 'text-3xl whitespace-nowrap sm:text-4xl',
        )}
      >
        <span className="text-coral">{m.prefix}</span>
        {typeof m.value === 'number' ? <CountUp value={m.value} /> : m.value}
        <span className="text-coral">{m.suffix}</span>
      </dd>
    </div>
  )
}
