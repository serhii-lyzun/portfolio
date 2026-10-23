import type { DiagramMedia } from '@/content/types'
import { diagramLayout as layout, diagramText, type Point } from '@/lib/diagramLayout'
import { cn } from '@/lib/utils'

type Props = { diagram: DiagramMedia; color: string; className?: string }

/**
 * Animated architecture diagram for cases without screenshots.
 * Horizontal when its container is ≥ 42rem wide, vertical otherwise (cards, phones).
 * Dashes flow along each edge to show direction.
 */
export function DiagramView({ diagram, color, className }: Props) {
  return (
    <figure
      className={cn('@container rounded-xl border border-ink/10 bg-night-900/80 p-4', className)}
    >
      <p className="sr-only">{diagramText(diagram)}</p>
      <Flow diagram={diagram} color={color} vertical={false} className="hidden @2xl:block" />
      <Flow diagram={diagram} color={color} vertical className="@2xl:hidden" />
      {diagram.caption && (
        <figcaption className="mt-3 text-center text-xs text-ink-muted">
          {diagram.caption}
        </figcaption>
      )}
    </figure>
  )
}

function Flow({ diagram, color, vertical, className }: Props & { vertical: boolean }) {
  const { pos, columns, maxRows } = layout(diagram, vertical)
  const height = vertical ? `${columns * 4.5}rem` : `${Math.max(maxRows * 5, 9)}rem`

  return (
    <div className={cn('relative', className)} style={{ height }} aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {diagram.edges.map(([from, to]) => {
          const a = pos.get(from)!
          const b = pos.get(to)!
          return (
            <g key={`${from}-${to}`}>
              <line
                {...line(a, b)}
                stroke={color}
                strokeOpacity={0.25}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              <line
                {...line(a, b)}
                stroke={color}
                strokeWidth={2}
                strokeDasharray="2 14"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="animate-[flow_1.2s_linear_infinite] motion-reduce:animate-none"
              />
            </g>
          )
        })}
      </svg>
      <ul className="contents">
        {diagram.nodes.map((node) => {
          const p = pos.get(node.id)!
          return (
            <li
              key={node.id}
              className="absolute w-max max-w-[9.5rem] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-night-800 px-3 py-2 text-center shadow-lg shadow-black/40"
              style={{ left: `${p.x}%`, top: `${p.y}%`, borderColor: `${color}55` }}
            >
              <span className="block text-xs font-medium text-ink sm:text-sm">{node.label}</span>
              {node.detail && (
                <span className="block text-[11px] text-ink-muted">{node.detail}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const line = (a: Point, b: Point) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
