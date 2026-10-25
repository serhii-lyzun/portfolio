import { ArrowRight, Images, Star } from 'lucide-react'
import type { CaseStudy, ScreenshotMedia } from '@/content/types'
import { caseHref } from '@/hooks/useCaseRoute'
import { diagramText } from '@/lib/diagramLayout'
import { lightbox } from '@/lib/lightbox'
import { cn } from '@/lib/utils'
import {
  CaseContribution,
  CaseIcon,
  CaseLinks,
  CaseMedia,
  CaseMetrics,
  NdaBadge,
} from './CaseParts'

type Props = {
  item: CaseStudy
  /** `tour`: desktop 3D tour card. Its media lives in the scene, so the card links to it instead. */
  variant?: 'grid' | 'tour'
}

/**
 * Compact case for the page: what it is, the numbers, the results, the proof (links/visuals).
 * The full STAR story opens in the case sheet (`#/case/<slug>`).
 */
export function CaseCard({ item, variant = 'grid' }: Props) {
  const tour = variant === 'tour'
  const featured = item.featured && !tour
  const screenshots = item.media.filter((m): m is ScreenshotMedia => m.kind === 'screenshot')

  return (
    <article
      id={`case-${item.slug}`}
      aria-labelledby={`case-${item.slug}-title`}
      className={cn(
        'relative grid grid-cols-[minmax(0,1fr)] gap-8 overflow-hidden rounded-3xl border border-ink/10 bg-night-900/70 p-5 sm:p-8',
        featured && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:p-10',
        // Tour cards sit over the 3D scene: keep them readable
        tour && 'bg-night-900/90 backdrop-blur-md',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: item.node.color }}
      />

      <div className="relative flex flex-col gap-5">
        <header className="flex items-start gap-4">
          <CaseIcon item={item} />
          <div className="min-w-0">
            {item.featured && (
              <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-coral uppercase">
                <Star className="size-3.5 fill-current" aria-hidden />
                Featured case
              </p>
            )}
            <h3
              id={`case-${item.slug}-title`}
              className={cn('font-display font-bold', featured ? 'text-3xl' : 'text-2xl')}
            >
              {item.title}
            </h3>
            <p className="mt-1 text-ink-muted">{item.tagline}</p>
          </div>
        </header>

        <p className="text-sm text-ink-muted">
          {item.company} · {item.period}
        </p>
        {item.nda && <NdaBadge note={item.ndaNote} />}

        <CaseContribution item={item} />
        <CaseMetrics item={item} />

        <div>
          <h4 className="text-xs font-semibold tracking-wider text-ink-muted uppercase">Result</h4>
          <ul className="mt-2 space-y-1.5">
            {item.star.result.map((r) => (
              <li key={r} className="flex gap-2 text-sm leading-relaxed">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.node.color }}
                  aria-hidden
                />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={caseHref(item.slug)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium transition-colors hover:border-cyan hover:text-cyan"
          >
            Read the full case
            <span className="sr-only">: {item.title}</span>
            <ArrowRight className="size-4" aria-hidden />
          </a>
          <CaseLinks item={item} className="contents" />
          {tour && screenshots.length > 0 && (
            <button
              type="button"
              onClick={() => lightbox.open(screenshots, 0, item.title)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ink-muted transition-colors hover:text-cyan"
            >
              <Images className="size-4" aria-hidden />
              Screenshots ({screenshots.length})
            </button>
          )}
        </div>
        {tour &&
          item.media.map((m, i) =>
            m.kind === 'diagram' ? (
              <p key={i} className="sr-only">
                {m.caption}: {diagramText(m)}
              </p>
            ) : null,
          )}
      </div>

      {!tour && (
        <div className="relative">
          <CaseMedia
            item={item}
            // Card stack images are ~84% of the card's inner width
            sizes={
              featured
                ? '(min-width: 1024px) 40vw, (min-width: 640px) 80vw, calc(84vw - 60px)'
                : '(min-width: 768px) 36vw, calc(84vw - 60px)'
            }
          />
        </div>
      )}
    </article>
  )
}
