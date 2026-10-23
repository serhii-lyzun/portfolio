import { Quote } from 'lucide-react'
import { contactIcons } from '@/components/iconMaps'
import { LinkButton } from '@/components/LinkButton'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { RECOMMENDATIONS_URL, testimonials } from '@/content/testimonials'
import { cn } from '@/lib/utils'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

const monthYear = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** LinkedIn recommendations, verbatim. Renders nothing until there is at least one. */
export function Testimonials() {
  if (testimonials.length === 0) return null

  return (
    <section
      aria-labelledby="testimonials"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading id="testimonials" index="04" title="What colleagues say">
        LinkedIn recommendations from a manager, a teammate and a client.
      </SectionHeading>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          // The first (longest) recommendation is featured: two columns wide, the others stack beside it
          <Reveal
            as="li"
            key={t.name}
            delay={i * 120}
            className={cn(i === 0 && 'lg:col-span-2 lg:row-span-2')}
          >
            <figure className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-night-900/70 p-6 transition-colors duration-300 hover:border-cyan/40 sm:p-8">
              <Quote
                aria-hidden
                className="absolute -top-2 -right-2 size-24 rotate-180 text-cyan/5 transition-colors duration-300 group-hover:text-cyan/10"
              />
              {t.highlight && (
                <p
                  aria-hidden
                  className="relative mb-6 font-display text-2xl leading-tight font-bold text-coral sm:text-4xl"
                >
                  “{t.highlight}”
                </p>
              )}
              <blockquote
                className={cn(
                  'relative flex-1 space-y-3 leading-relaxed text-ink',
                  i === 0 && 'lg:text-lg',
                )}
              >
                {t.quote.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </blockquote>
              <figcaption className="relative mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                <span
                  aria-hidden
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan/25 to-coral/25 font-display text-sm font-bold"
                >
                  {initials(t.name)}
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block font-semibold text-ink">{t.name}</span>
                  <span className="block text-ink-muted">
                    {t.role}
                    {t.company && `, ${t.company}`}
                  </span>
                  <span className="block text-xs text-ink-muted/80">
                    {t.relation} · {monthYear(t.date)}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
      <div className="mt-8">
        <LinkButton
          href={RECOMMENDATIONS_URL}
          external
          magnetic
          icon={<contactIcons.linkedin className="size-4" />}
        >
          Read them on LinkedIn
        </LinkButton>
      </div>
    </section>
  )
}
