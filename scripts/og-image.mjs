// Renders the link-preview image (public/og-image.jpg) and the Apple touch icon with Playwright's Chromium.
// Usage: npm run og   (re-run after changing the headline, facts or photo)
import { chromium } from '@playwright/test'

const root = new URL('../', import.meta.url)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })

await page.goto(new URL('scripts/og-image.html', root).href)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({
  path: new URL('public/og-image.jpg', root).pathname,
  type: 'jpeg',
  quality: 90,
})

// 180×180 touch icon from the favicon (iOS home screen, some link previews)
await page.setViewportSize({ width: 180, height: 180 })
await page.setContent(
  `<body style="margin:0;background:#070b14"><img src="${new URL('public/favicon.svg', root).href}" width="180" height="180"></body>`,
)
await page.waitForLoadState('load')
await page.screenshot({ path: new URL('public/apple-touch-icon.png', root).pathname })

await browser.close()
console.log('wrote public/og-image.jpg (1200×630) and public/apple-touch-icon.png (180×180)')
