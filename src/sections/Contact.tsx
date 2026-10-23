import { MapPin } from 'lucide-react'
import { contactIcons } from '@/components/iconMaps'
import { LinkButton } from '@/components/LinkButton'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { profile } from '@/content/profile'
import { testimonials } from '@/content/testimonials'

export function Contact() {
  return (
    <section aria-labelledby="contact" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="relative overflow-hidden rounded-3xl border border-ink/10 bg-night-900/70 p-8 sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-32 size-96 rounded-full bg-coral/15 blur-3xl"
        />
        <SectionHeading
          id="contact"
          index={testimonials.length > 0 ? '05' : '04'}
          title="Contact"
          className="mb-8 sm:mb-10"
        >
          Open to Senior Full-Stack Engineer roles. Email me or connect on LinkedIn.
        </SectionHeading>

        <a
          href={`mailto:${profile.email}`}
          className="relative block font-display text-2xl font-bold break-all text-coral transition-colors hover:text-coral-soft sm:text-4xl"
        >
          {profile.email}
        </a>

        <ul className="relative mt-8 flex flex-wrap gap-3">
          {profile.contacts
            .filter((c) => c.kind !== 'email')
            .map((c) => {
              const Icon = contactIcons[c.kind]
              return (
                <li key={c.kind}>
                  <LinkButton href={c.href} external magnetic icon={<Icon className="size-4" />}>
                    {c.label}
                  </LinkButton>
                </li>
              )
            })}
        </ul>

        <p className="relative mt-8 inline-flex items-center gap-2 text-sm text-ink-muted">
          <MapPin className="size-4 text-cyan" aria-hidden />
          {profile.location} · {profile.availability}
        </p>
      </Reveal>
    </section>
  )
}
