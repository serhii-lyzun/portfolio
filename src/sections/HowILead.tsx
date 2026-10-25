import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { leadership } from '@/content/leadership'

/** Soft skills as stories with proof, not a list of adjectives. */
export function HowILead() {
  return (
    <section aria-labelledby="leadership" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading id="leadership" index="03" title="How I lead">
        Small teams of 1–5, code-quality standards that lift the whole team, and stakeholders
        validating the work at each stage.
      </SectionHeading>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {leadership.map((story, i) => (
          <Reveal
            as="li"
            key={story.title}
            delay={i * 90}
            className="flex flex-col rounded-2xl border border-ink/10 bg-night-900/70 p-6"
          >
            <h3 className="font-display text-lg font-bold">{story.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{story.story}</p>
            <p className="mt-5 font-display font-bold text-coral">{story.proof}</p>
            {story.proofNote && (
              <p className="mt-1 text-xs leading-snug text-ink-muted">{story.proofNote}</p>
            )}
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
