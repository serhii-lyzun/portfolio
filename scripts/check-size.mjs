// Fails the build when the bundles outgrow the plan's budgets (PORTFOLIO_SITE_PLAN.md § 4.4).
// Usage: node scripts/check-size.mjs   (after `vite build`)
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const DIST = new URL('../dist/', import.meta.url).pathname
const KB = 1024

const budgets = [
  // Everything the first paint needs: the entry script and stylesheet referenced by index.html
  {
    name: 'initial JS',
    limit: 150 * KB,
    files: () => entry('script', /src="[^"]*\/(assets\/[^"]+\.js)"/g),
  },
  {
    name: 'initial CSS',
    limit: 20 * KB,
    files: () => entry('link', /href="[^"]*\/(assets\/[^"]+\.css)"/g),
  },
  // The lazy WebGL chunk (desktop only, after first paint)
  { name: '3D chunk', limit: 350 * KB, files: () => assets(/^Experience-.*\.js$/) },
]

function entry(_kind, pattern) {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8')
  return [...html.matchAll(pattern)].map((m) => m[1])
}

function assets(pattern) {
  return readdirSync(join(DIST, 'assets'))
    .filter((f) => pattern.test(f))
    .map((f) => `assets/${f}`)
}

let failed = false
for (const budget of budgets) {
  const files = budget.files()
  if (files.length === 0) {
    console.error(`✗ ${budget.name}: no files found`)
    failed = true
    continue
  }
  const size = files.reduce((sum, f) => sum + gzipSync(readFileSync(join(DIST, f))).length, 0)
  const ok = size <= budget.limit
  failed ||= !ok
  console.log(
    `${ok ? '✓' : '✗'} ${budget.name.padEnd(12)} ${(size / KB).toFixed(1).padStart(6)} KB gz` +
      ` / ${(budget.limit / KB).toFixed(0)} KB  (${files.join(', ')})`,
  )
}
process.exit(failed ? 1 : 0)
