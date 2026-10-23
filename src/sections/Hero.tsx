import { Fragment, type CSSProperties } from 'react'
import { ArrowDown, MapPin } from 'lucide-react'
import { CvButton } from '@/components/CvButton'
import { Picture } from '@/components/Picture'
import { profile } from '@/content/profile'

/** Entrance timing: letters of the name first, then each following line. */
const LETTER_MS = 35
const nameDone = profile.name.length * LETTER_MS
/** Words of the name with the index of their first letter (keeps one continuous letter stagger) */
const nameWords = profile.name.split(' ').map((word, i, words) => ({
  word,
  start: words.slice(0, i).join(' ').length + (i > 0 ? 1 : 0),
}))
const enter = (step: number) => ({ animationDelay: `${nameDone + step * 120}ms` }) as CSSProperties
const ENTER = 'motion-safe:animate-[fade-up_0.8s_cubic-bezier(0.2,0.7,0.2,1)_both]'

/** Above the fold: name, profession + domain, contacts and CV. */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative mx-auto grid min-h-svh max-w-6xl content-center items-center gap-6 px-4 pt-20 pb-16 sm:px-6 md:grid-cols-[1.25fr_1fr] md:gap-10 md:pt-16"
    >
      <div className="relative z-10 order-2 md:order-1">
        <p
          className={`font-display text-sm tracking-[0.3em] text-cyan uppercase ${ENTER}`}
          style={{ animationDelay: '0ms' }}
        >
          {profile.domain}
        </p>
        <h1
          id="hero-title"
          aria-label={profile.name}
          className="mt-4 font-display text-5xl leading-[1.05] font-bold sm:text-7xl"
        >
          {/* Kinetic type: each letter rises in; the accessible name is the aria-label. Letters are
              grouped per word so a line can only break between words, never inside one. */}
          {nameWords.map(({ word, start }, w) => (
            <Fragment key={word}>
              {w > 0 && ' '}
              <span aria-hidden className="inline-block whitespace-nowrap">
                {[...word].map((char, i) => (
                  <span
                    key={i}
                    className="inline-block motion-safe:animate-[rise_0.9s_cubic-bezier(0.2,0.7,0.2,1)_both]"
                    style={{ animationDelay: `${(start + i) * LETTER_MS}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>
        <p className={`mt-4 font-display text-xl text-coral sm:text-2xl ${ENTER}`} style={enter(0)}>
          {profile.headline}
        </p>

        <ul
          className={`mt-6 flex flex-wrap gap-2 ${ENTER}`}
          style={enter(1)}
          aria-label="Key facts"
        >
          {profile.facts.map((fact) => (
            <li key={fact} className="rounded-full border border-ink/15 px-3 py-1 text-sm">
              {fact}
            </li>
          ))}
        </ul>

        <p
          className={`mt-6 max-w-xl text-lg leading-relaxed text-ink-muted ${ENTER}`}
          style={enter(2)}
        >
          {profile.summary}
        </p>

        <div className={`mt-8 flex flex-wrap gap-3 ${ENTER}`} style={enter(3)}>
          <a
            href="#cases"
            data-magnetic
            data-cursor="Explore"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-6 py-3 font-medium text-night-950 transition-colors hover:bg-coral-soft"
          >
            Explore cases
            <ArrowDown className="size-4" aria-hidden />
          </a>
          <CvButton label="View CV" className="px-6 py-3 text-base" magnetic />
        </div>

        <p
          className={`mt-8 inline-flex items-center gap-2 text-sm text-ink-muted ${ENTER}`}
          style={enter(4)}
        >
          <MapPin className="size-4 text-cyan" aria-hidden />
          {profile.location} · {profile.availability}
        </p>
      </div>

      <div
        className={`relative order-1 mx-auto w-full max-w-[11rem] sm:max-w-sm md:order-2 md:max-w-none ${ENTER}`}
        style={{ animationDelay: '150ms', animationDuration: '1.4s' }}
      >
        <div aria-hidden className="absolute inset-[10%] rounded-full bg-coral/20 blur-3xl" />
        {/* The studio photo's black backdrop melts into the page */}
        <Picture
          picture={profile.photo}
          alt={profile.photoAlt}
          sizes="(min-width: 768px) 420px, (min-width: 640px) 384px, 176px"
          priority
          className="relative block"
          imgClassName="mx-auto h-auto w-full max-w-[420px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_45%,black_50%,transparent_100%)]"
        />
      </div>
    </section>
  )
}
