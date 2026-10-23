import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cases } from '@/content/cases'
import type { CaseStudy } from '@/content/types'
import { caseHref } from '@/hooks/useCaseRoute'
import { CaseIcon, CaseLinks, CaseMedia, CaseMetrics, NdaBadge, StackChips } from './CaseParts'

type Props = { item: CaseStudy | undefined; onClose: () => void }

/** Full case in STAR format (Lesson 29) + the Lesson 30 deep-dive, deep-linkable via `#/case/<slug>`. */
export function CaseSheet({ item, onClose }: Props) {
  const scroller = useRef<HTMLDivElement>(null)

  // Every case (including prev/next inside the sheet) starts at its title
  useLayoutEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [item?.slug])

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        ref={scroller}
        side="right"
        className="w-full gap-0 overflow-y-auto border-ink/10 bg-night-900 p-0 outline-none sm:max-w-2xl lg:max-w-3xl"
        // Start reading at the title instead of focusing (and fanning out) the first control
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).focus({ preventScroll: true })
        }}
      >
        {item && <CaseDetail item={item} />}
      </SheetContent>
    </Sheet>
  )
}

function CaseDetail({ item }: { item: CaseStudy }) {
  const index = cases.indexOf(item)
  const prev = cases[(index - 1 + cases.length) % cases.length]
  const next = cases[(index + 1) % cases.length]

  return (
    <>
      <SheetHeader className="gap-4 border-b border-ink/10 p-6 pr-14 sm:p-8 sm:pr-16">
        <div className="flex items-start gap-4">
          <CaseIcon item={item} />
          <div>
            <SheetTitle className="font-display text-2xl font-bold sm:text-3xl">
              {item.title}
            </SheetTitle>
            <SheetDescription className="mt-1 text-base">{item.tagline}</SheetDescription>
          </div>
        </div>
        <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-ink-muted">Company</dt>
          <dd>{item.company}</dd>
          <dt className="text-ink-muted">Role</dt>
          <dd>{item.role}</dd>
          <dt className="text-ink-muted">Period</dt>
          <dd>{item.period}</dd>
        </dl>
        {item.nda && <NdaBadge note={item.ndaNote} />}
        <CaseLinks item={item} />
      </SheetHeader>

      <div className="flex flex-col gap-10 p-6 sm:p-8">
        <CaseMetrics item={item} />
        <CaseMedia item={item} sizes="(min-width: 768px) 700px, 92vw" />

        <Block label="S" title="Situation" color={item.node.color}>
          <p>{item.star.situation}</p>
        </Block>
        <Block label="T" title="Task" color={item.node.color}>
          <p>{item.star.task}</p>
        </Block>
        <Block label="A" title="Action" color={item.node.color}>
          <Bullets items={item.star.action} color={item.node.color} />
        </Block>
        <Block label="R" title="Result" color={item.node.color}>
          <Bullets items={item.star.result} color={item.node.color} />
        </Block>

        {item.deepDive && (
          <section aria-labelledby="deep-dive" className="flex flex-col gap-6">
            <h3 id="deep-dive" className="font-display text-xl font-bold">
              How I approached it
            </h3>
            <ol className="grid gap-4 sm:grid-cols-2">
              {item.deepDive.approach.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-ink/10 bg-night-950/40 p-4"
                >
                  <p className="font-display text-sm font-bold" style={{ color: item.node.color }}>
                    {String(i + 1).padStart(2, '0')} · {step.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
                </li>
              ))}
            </ol>
            {item.deepDive.hardestPart && (
              <Callout title="The hardest part">{item.deepDive.hardestPart}</Callout>
            )}
            {item.deepDive.whatItShows && (
              <Callout title="What this shows">{item.deepDive.whatItShows}</Callout>
            )}
          </section>
        )}

        <section aria-labelledby="stack">
          <h3
            id="stack"
            className="mb-3 text-xs font-semibold tracking-wider text-ink-muted uppercase"
          >
            Stack
          </h3>
          <StackChips stack={item.stack} />
        </section>

        <nav
          aria-label="Other cases"
          className="flex justify-between gap-4 border-t border-ink/10 pt-6 text-sm"
        >
          <a
            href={caseHref(prev.slug)}
            className="inline-flex items-center gap-2 text-ink-muted hover:text-cyan"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {prev.title}
          </a>
          <a
            href={caseHref(next.slug)}
            className="inline-flex items-center gap-2 text-right text-ink-muted hover:text-cyan"
          >
            {next.title}
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </nav>
      </div>
    </>
  )
}

function Block({
  label,
  title,
  color,
  children,
}: {
  label: string
  title: string
  color: string
  children: ReactNode
}) {
  return (
    <section className="grid grid-cols-[2.5rem_1fr] gap-4">
      <span
        className="flex size-10 items-center justify-center rounded-full font-display font-bold"
        style={{ backgroundColor: `${color}1f`, color }}
        aria-hidden
      >
        {label}
      </span>
      <div className="leading-relaxed">
        <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
        {children}
      </div>
    </section>
  )
}

function Bullets({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2">
      {items.map((text) => (
        <li key={text} className="flex gap-3">
          <span
            className="mt-2.5 size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          {text}
        </li>
      ))}
    </ul>
  )
}

function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border-l-2 border-cyan bg-cyan/5 p-4">
      <p className="text-sm font-semibold text-cyan">{title}</p>
      <p className="mt-1 text-sm leading-relaxed">{children}</p>
    </div>
  )
}
