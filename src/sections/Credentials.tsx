import { Award } from 'lucide-react'
import { credentials } from '@/content/profile'

export function Credentials() {
  return (
    <section aria-labelledby="credentials" className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2
        id="credentials"
        className="text-xs font-semibold tracking-wider text-ink-muted uppercase"
      >
        Courses &amp; certifications
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {credentials.map((c) => (
          <li
            key={c.title}
            className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-night-900/70 p-5"
          >
            <Award className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-ink-muted">
                {c.issuer} · {c.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
