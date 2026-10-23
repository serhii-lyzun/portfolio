import type { DiagramMedia } from '@/content/types'

export type Point = { x: number; y: number }

/** Columns = distance from the first node; rows = order inside a column. Coordinates in 0..100. */
export function diagramLayout({ nodes, edges }: DiagramMedia, vertical: boolean) {
  const depth = new Map<string, number>([[nodes[0].id, 0]])
  const queue = [nodes[0].id]
  while (queue.length) {
    const id = queue.shift()!
    for (const [from, to] of edges) {
      if (from === id && !depth.has(to)) {
        depth.set(to, depth.get(id)! + 1)
        queue.push(to)
      }
    }
  }
  const columns: string[][] = []
  for (const node of nodes) (columns[depth.get(node.id) ?? 0] ??= []).push(node.id)

  const pos = new Map<string, Point>()
  columns.forEach((column, c) =>
    column.forEach((id, r) => {
      const main = ((c + 0.5) / columns.length) * 100
      const cross = ((r + 0.5) / column.length) * 100
      pos.set(id, vertical ? { x: cross, y: main } : { x: main, y: cross })
    }),
  )
  const maxRows = Math.max(...columns.map((c) => c.length))
  return { pos, columns: columns.length, maxRows }
}

/** Text version of a diagram for screen readers, e.g. "User → AI Chatbot; AI Chatbot → LLM agent" */
export function diagramText(diagram: DiagramMedia) {
  const label = (id: string) => diagram.nodes.find((n) => n.id === id)?.label ?? id
  return diagram.edges.map(([from, to]) => `${label(from)} → ${label(to)}`).join('; ')
}
