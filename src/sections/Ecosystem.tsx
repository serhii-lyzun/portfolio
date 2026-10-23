import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { cases, getCase } from '@/content/cases'
import { CORE_ID, coreConnectedCases, ecosystem } from '@/content/ecosystem'
import type { CaseSlug } from '@/content/types'
import { caseHref } from '@/hooks/useCaseRoute'
import { cn } from '@/lib/utils'

// Static 2D map of the constellation (plan § 2.2 "Ecosystem overview"). It doubles as the
// no-WebGL / reduced-motion fallback in M7. Positions are % of the map box.
const POSITIONS: Record<string, [x: number, y: number]> = {
  [CORE_ID]: [42, 50],
  web: [42, 12],
  here: [42, 88],
  'excel-add-in': [17, 30],
  marketplace: [11, 8],
  'map-sdk': [17, 72],
  npm: [11, 93],
  'stripe-billing': [67, 24],
  stripe: [67, 6],
  'ai-mcp': [67, 76],
  llm: [67, 94],
  'nda-logistics': [89, 50],
}

type Edge = { from: string; to: string; color: string }

const edges: Edge[] = [
  ...coreConnectedCases.map((slug) => ({
    from: slug,
    to: CORE_ID,
    color: getCase(slug)!.node.color,
  })),
  ...ecosystem.flatMap((node) =>
    node.connectsTo.map((to) => ({
      from: node.id,
      to,
      color: getCase(to)?.node.color ?? '#3fe0e8',
    })),
  ),
]

export function Ecosystem() {
  const nda = cases.find((c) => c.nda)

  return (
    <section aria-labelledby="ecosystem" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading id="ecosystem" index="02" title="Ecosystem">
        One shared Node.js API behind 8+ sub-systems. Every new channel (Excel, SDK, AI tools)
        reuses the same routing rules, so all products give the same answer.
      </SectionHeading>

      {/* Desktop / tablet: the map */}
      <div className="relative hidden aspect-[16/9] rounded-3xl border border-ink/10 bg-night-900/60 md:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {edges.map(({ from, to, color }) => {
            const [x1, y1] = POSITIONS[from]
            const [x2, y2] = POSITIONS[to]
            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeOpacity={0.25}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeDasharray="2 14"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="animate-[flow_1.6s_linear_infinite] motion-reduce:animate-none"
                />
              </g>
            )
          })}
        </svg>

        {/* NDA case: separate client, drawn as its own fogged cluster */}
        <div
          aria-hidden
          className="absolute top-1/2 left-[89%] size-44 -translate-1/2 rounded-full border border-dashed border-ink/20 bg-ink/[0.02]"
        />

        <ul aria-label="Platform map">
          {ecosystem.map((node) => (
            <MapNode key={node.id} id={node.id} label={node.label} core={node.kind === 'core'} />
          ))}
          {cases.map((item) => (
            <MapNode
              key={item.slug}
              id={item.slug}
              label={item.title}
              slug={item.slug}
              color={item.node.color}
              metric={item.headlineMetric}
            />
          ))}
        </ul>
        {nda && (
          <p className="absolute top-[64%] left-[89%] w-40 -translate-x-1/2 text-center text-[11px] text-ink-muted">
            Different client, separate system
          </p>
        )}
      </div>

      {/* Phones: the same information as a list */}
      <div className="rounded-3xl border border-ink/10 bg-night-900/60 p-5 md:hidden">
        <p className="mx-auto w-max rounded-full border border-cyan/50 bg-cyan/10 px-4 py-2 font-display font-bold text-cyan">
          Node.js API
        </p>
        <ul className="mt-5 space-y-3">
          {coreConnectedCases.map((slug) => (
            <CaseRow key={slug} slug={slug} />
          ))}
        </ul>
        {nda && (
          <>
            <p className="mt-6 mb-3 text-center text-xs text-ink-muted">
              Different client, separate system
            </p>
            <ul>
              <CaseRow slug={nda.slug} />
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

function MapNode({
  id,
  label,
  slug,
  color,
  metric,
  core,
}: {
  id: string
  label: string
  slug?: CaseSlug
  color?: string
  metric?: string
  core?: boolean
}) {
  const [x, y] = POSITIONS[id]
  const style = { left: `${x}%`, top: `${y}%`, '--c': color } as CSSProperties
  const base = 'absolute w-max -translate-1/2 rounded-xl border text-center'

  if (slug)
    return (
      <li
        className={cn(
          base,
          'border-(--c)/50 bg-night-800 shadow-lg shadow-black/40 transition-transform hover:scale-105',
        )}
        style={style}
      >
        <a href={caseHref(slug)} className="block px-4 py-2.5">
          <span className="block text-sm font-semibold text-ink">{label}</span>
          <span className="block text-xs text-(--c)">{metric}</span>
        </a>
      </li>
    )

  return (
    <li
      className={cn(
        base,
        core
          ? 'border-cyan/60 bg-cyan/10 px-5 py-3 font-display text-lg font-bold text-cyan shadow-[0_0_40px_-8px] shadow-cyan/60'
          : 'border-ink/15 bg-night-900 px-3 py-1.5 text-xs text-ink-muted',
      )}
      style={style}
    >
      {label}
    </li>
  )
}

function CaseRow({ slug }: { slug: CaseSlug }) {
  const item = getCase(slug)!
  return (
    <li>
      <a
        href={caseHref(slug)}
        className="flex items-center justify-between gap-3 rounded-xl border bg-night-800 px-4 py-3"
        style={{ borderColor: `${item.node.color}66` }}
      >
        <span className="font-semibold">{item.title}</span>
        <span className="text-right text-xs" style={{ color: item.node.color }}>
          {item.headlineMetric}
        </span>
      </a>
    </li>
  )
}
