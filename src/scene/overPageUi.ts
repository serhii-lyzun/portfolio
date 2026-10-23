/**
 * The canvas sits behind the page and receives events through the app root. A pointer over page
 * content (text, links, cards, the photo) is not aimed at the scene.
 */
export function overPageUi(event: Event) {
  const target = event.target as Element | null
  return !!target?.closest('a, button, h1, h2, p, li, picture, article, [role="dialog"]')
}
