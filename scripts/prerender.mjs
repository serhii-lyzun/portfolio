// Injects the server-rendered app and the JSON-LD structured data into dist/index.html (run after the client and SSR builds).
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const MARKER = '<!--app-html-->'
const HEAD_MARKER = '<!--app-head-->'
const dist = new URL('../dist/', import.meta.url)
const ssr = new URL('../dist-ssr/', import.meta.url)

const { render, head } = await import(new URL('entry-server.js', ssr).href)
const page = new URL('index.html', dist)
const html = readFileSync(page, 'utf8')
for (const marker of [MARKER, HEAD_MARKER])
  if (!html.includes(marker)) throw new Error(`${marker} not found in dist/index.html`)

const app = render()
writeFileSync(page, html.replace(HEAD_MARKER, head()).replace(MARKER, app))
rmSync(ssr, { recursive: true, force: true })
console.log(`prerendered dist/index.html (${(app.length / 1024).toFixed(1)} KB of HTML)`)
