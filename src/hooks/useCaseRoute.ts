import { useCallback, useEffect, useState } from 'react'
import { getCase } from '@/content/cases'

const PREFIX = '#/case/'

/** Hash route for a single case, e.g. https://serhii-lyzun.github.io/portfolio/#/case/excel-add-in */
export const caseHref = (slug: string) => `${PREFIX}${slug}`

const readSlug = () =>
  window.location.hash.startsWith(PREFIX)
    ? decodeURIComponent(window.location.hash.slice(PREFIX.length))
    : null

/**
 * Case deep-links on GitHub Pages (no server rewrites, so hash routing; plan § 4.1).
 * Plain section anchors like `#cases` are left alone.
 */
export function useCaseRoute() {
  // Starts closed (matches the prerendered HTML); a deep link opens right after hydration
  const [slug, setSlug] = useState<string | null>(null)

  useEffect(() => {
    const onHashChange = () => setSlug(readSlug())
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const close = useCallback(() => {
    // Drop the hash without adding a history entry or jumping the page
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    setSlug(null)
  }, [])

  return { activeCase: slug ? getCase(slug) : undefined, close }
}
