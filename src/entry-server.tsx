import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

/**
 * Build-time prerender (scripts/prerender.mjs): the page's full HTML is in index.html, so text
 * and images paint before any JS runs, and crawlers / link previews see the real content.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
