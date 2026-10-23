import { SectionHeading } from '@/components/SectionHeading'
import { testimonials } from '@/content/testimonials'

/** LinkedIn recommendations (Lesson 30). Renders nothing until there is at least one. */
export function Testimonials() {
  if (testimonials.length === 0) return null

  return (
    <section
      aria-labelledby="testimonials"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading id="testimonials" index="04" title="What colleagues say" />
      <ul className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={t.name}>
            <figure className="h-full rounded-2xl border border-ink/10 bg-night-900/70 p-6">
              <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-ink-muted">
                {t.href ? (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-cyan"
                  >
                    {t.name}
                  </a>
                ) : (
                  <span className="text-ink">{t.name}</span>
                )}
                , {t.role}, {t.company}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
