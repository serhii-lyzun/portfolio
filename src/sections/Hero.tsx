import { ArrowDown, MapPin } from 'lucide-react'
import { CvButton } from '@/components/CvButton'
import { Picture } from '@/components/Picture'
import { profile } from '@/content/profile'

/** Lesson 29 must-haves above the fold: name, profession + domain, contacts/CV. */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative mx-auto grid min-h-svh max-w-6xl content-center items-center px-4 gap-6 pt-20 pb-16 sm:px-6 md:grid-cols-[1.25fr_1fr] md:gap-10 md:pt-16"
    >
      <div className="relative z-10 order-2 md:order-1">
        <p className="font-display text-sm tracking-[0.3em] text-cyan uppercase">
          {profile.domain}
        </p>
        <h1
          id="hero-title"
          className="mt-4 font-display text-5xl leading-[1.05] font-bold sm:text-7xl"
        >
          {profile.name}
        </h1>
        <p className="mt-4 font-display text-xl text-coral sm:text-2xl">{profile.headline}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Key facts">
          {profile.facts.map((fact) => (
            <li key={fact} className="rounded-full border border-ink/15 px-3 py-1 text-sm">
              {fact}
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{profile.summary}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#cases"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-6 py-3 font-medium text-night-950 transition-colors hover:bg-coral-soft"
          >
            Explore cases
            <ArrowDown className="size-4" aria-hidden />
          </a>
          <CvButton label="View CV" className="px-6 py-3 text-base" />
        </div>

        <p className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted">
          <MapPin className="size-4 text-cyan" aria-hidden />
          {profile.location} · {profile.availability}
        </p>
      </div>

      <div className="relative order-1 mx-auto w-full max-w-[11rem] sm:max-w-sm md:order-2 md:max-w-none">
        <div aria-hidden className="absolute inset-[10%] rounded-full bg-coral/20 blur-3xl" />
        {/* The studio photo's black backdrop melts into the page (plan § 4.6) */}
        <Picture
          picture={profile.photo}
          alt={profile.photoAlt}
          sizes="(min-width: 768px) 420px, 320px"
          priority
          className="relative block"
          imgClassName="mx-auto h-auto w-full max-w-[420px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_45%,black_50%,transparent_100%)]"
        />
      </div>
    </section>
  )
}
