import { CaseCard } from '@/components/case/CaseCard'
import { SectionHeading } from '@/components/SectionHeading'
import { cases } from '@/content/cases'

/** Static case list (M3). In M4–M5 the 3D constellation takes over the focus/tour on desktop. */
export function Cases() {
  const [featured, ...rest] = cases

  return (
    <section aria-labelledby="cases" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading id="cases" index="01" title="Cases">
        Five commercial projects, each told in STAR format: Situation, Task, Action, Result. Open
        any case for the full story.
      </SectionHeading>

      <div className="flex flex-col gap-6">
        <CaseCard item={featured} />
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
