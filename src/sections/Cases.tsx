import { useEffect, useRef } from 'react'
import { CaseCard } from '@/components/case/CaseCard'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { cases } from '@/content/cases'
import type { CaseSlug } from '@/content/types'
import { useCan3D } from '@/hooks/useCan3D'
import { tour } from '@/lib/tour'

const INTRO =
  'Six commercial projects, each told in STAR format: Situation, Task, Action, Result. Open any case for the full story.'

/**
 * Desktop with 3D: a scroll tour. Cards scroll on the left; the constellation (fixed backdrop)
 * flies to whichever card is in the middle of the screen.
 * Everyone else: the static case grid.
 */
export function Cases() {
  const can3D = useCan3D()

  useEffect(() => {
    tour.set({ enabled: can3D })
  }, [can3D])

  return (
    <section
      id="cases-section"
      aria-labelledby="cases"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading id="cases" index="01" title="Cases">
        {INTRO}
      </SectionHeading>
      {can3D ? <CaseTour /> : <CaseGrid />}
    </section>
  )
}

function CaseGrid() {
  const [featured, ...rest] = cases
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <CaseCard item={featured} />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {rest.map((item, i) => (
          <Reveal key={item.slug} delay={(i % 2) * 120}>
            <CaseCard item={item} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function CaseTour() {
  const list = useRef<HTMLOListElement>(null)

  // The card crossing the middle band of the viewport is the active case
  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>('[data-case]')
    if (!items) return
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const slug = (e.target as HTMLElement).dataset.case!
          if (e.isIntersecting) visible.add(slug)
          else visible.delete(slug)
        }
        const active = cases.find((c) => visible.has(c.slug))?.slug ?? null
        tour.set({ active: active as CaseSlug | null })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      tour.set({ active: null })
    }
  }, [])

  return (
    <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-10">
      <ol ref={list} className="flex flex-col">
        {cases.map((item) => (
          <li key={item.slug} data-case={item.slug} className="flex min-h-[78vh] items-center py-6">
            <Reveal className="w-full">
              <CaseCard item={item} variant="tour" />
            </Reveal>
          </li>
        ))}
      </ol>
      {/* Right column stays empty: the constellation shows through here */}
      <div aria-hidden />
    </div>
  )
}
