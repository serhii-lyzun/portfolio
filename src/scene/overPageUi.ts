/**
 * The canvas sits behind the page and receives events through the app root. A pointer over page
 * content (text, links, cards) is not aimed at the scene. Decorative areas marked
 * `data-scene-through` (the hero portrait, whose edges fade into the constellation) let the
 * pointer reach the crystals behind them.
 */
export function overPageUi(event: Event) {
  const target = event.target as Element | null
  if (target?.closest('[data-scene-through]')) return false
  return !!target?.closest('a, button, h1, h2, p, li, picture, article, [role="dialog"]')
}
