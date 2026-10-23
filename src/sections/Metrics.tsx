import { profile } from '@/content/profile'

/** Impact numbers. The count-up animation is added in M6. */
export function Metrics() {
  return (
    <section aria-label="Impact in numbers" className="mx-auto max-w-6xl px-4 sm:px-6">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-5">
        {profile.metrics.map((m, i) => (
          <div
            key={m.label}
            className={
              'flex flex-col-reverse justify-end bg-night-900 p-6' +
              // Last tile spans the row when the 2-column grid would leave it alone
              (i === profile.metrics.length - 1 ? ' col-span-2 sm:col-span-1' : '')
            }
          >
            <dt className="mt-2 text-sm leading-snug text-ink-muted">{m.label}</dt>
            <dd className="font-display text-4xl font-bold text-ink sm:text-5xl">
              <span className="text-coral">{m.prefix}</span>
              {m.value}
              <span className="text-coral">{m.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
