import { describe, expect, it, vi } from 'vitest'
import { cases } from '@/content/cases'
import type { DiagramMedia } from '@/content/types'
import { diagramLayout, diagramText } from './diagramLayout'
import { tour } from './tour'

const diagrams = cases.flatMap((c) =>
  c.media.filter((m): m is DiagramMedia => m.kind === 'diagram'),
)

describe('tour store', () => {
  it('notifies only on real changes', () => {
    const listener = vi.fn()
    const unsubscribe = tour.subscribe(listener)
    tour.set({ mode: 'cases', active: 'excel-add-in' })
    tour.set({ mode: 'cases', active: 'excel-add-in' })
    tour.set({ active: 'map-sdk' })
    expect(listener).toHaveBeenCalledTimes(2)
    expect(tour.get()).toMatchObject({ mode: 'cases', active: 'map-sdk' })
    unsubscribe()
    tour.set({ mode: 'hero', active: null })
  })
})

describe('diagram layout', () => {
  it('lays a chain out as one row of columns', () => {
    const ai = cases.find((c) => c.slug === 'ai-mcp')!.media[0] as DiagramMedia
    const { columns, maxRows, pos } = diagramLayout(ai, false)
    expect(columns).toBe(ai.nodes.length)
    expect(maxRows).toBe(1)
    const xs = ai.nodes.map((n) => pos.get(n.id)!.x)
    expect(xs).toEqual([...xs].sort((a, b) => a - b))
  })

  it.each(diagrams)('places every node of "$caption" inside the box', (diagram) => {
    for (const vertical of [false, true]) {
      const { pos } = diagramLayout(diagram, vertical)
      for (const node of diagram.nodes) {
        const p = pos.get(node.id)!
        expect(p.x).toBeGreaterThan(0)
        expect(p.x).toBeLessThan(100)
        expect(p.y).toBeGreaterThan(0)
        expect(p.y).toBeLessThan(100)
      }
    }
  })

  it('describes the edges as text for screen readers', () => {
    const nda = cases.find((c) => c.nda)!.media[0] as DiagramMedia
    expect(diagramText(nda)).toBe(
      'React screens → Storybook library; React screens → Map features; Storybook library → Jest + RTL',
    )
  })
})
