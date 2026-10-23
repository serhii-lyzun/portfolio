import { expect, test, type Page } from '@playwright/test'

// Real-browser smoke tests for what a recruiter does: read the hero, open the CV, open a case,
// look at screenshots. Run with `npm run e2e` (builds are served by `vite preview`).

/** Collects uncaught errors and console errors for a test */
function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  return errors
}

test('hero shows the Lesson 29 must-haves and loads without errors', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('./')

  await expect(page).toHaveTitle(/Serhii Lyzun — Senior Full-Stack Engineer/)
  await expect(page.getByRole('heading', { level: 1, name: 'Serhii Lyzun' })).toBeVisible()
  await expect(page.getByText('Senior Full-Stack Engineer (React / Node.js)').first()).toBeVisible()
  await expect(page.getByRole('link', { name: /serhii\.lyzun@gmail\.com/ })).toHaveAttribute(
    'href',
    'mailto:serhii.lyzun@gmail.com',
  )

  await page.waitForLoadState('networkidle')
  expect(errors).toEqual([])
})

test('CV opens as a PDF in a new tab', async ({ page, request }) => {
  await page.goto('./')
  const cv = page.getByRole('link', { name: /View CV/ })
  await expect(cv).toHaveAttribute('target', '_blank')
  await expect(cv).toHaveAttribute('rel', /noopener/)

  const href = await cv.getAttribute('href')
  expect(href).toMatch(/\.pdf$/)
  const response = await request.get(href!)
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('application/pdf')
})

test('a case deep link opens the full STAR case and Esc closes it', async ({ page }) => {
  await page.goto('./#/case/excel-add-in')
  const sheet = page.getByRole('dialog', { name: 'MileMaker Excel Add-in' })
  await expect(sheet).toBeVisible()
  for (const section of ['Situation', 'Task', 'Action', 'Result', 'How I approached it']) {
    await expect(sheet.getByRole('heading', { name: section })).toBeVisible()
  }
  await expect(sheet.getByRole('link', { name: /Microsoft Marketplace/ })).toHaveAttribute(
    'href',
    'https://marketplace.microsoft.com/en-us/product/WA200006859',
  )

  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
  await expect(page).not.toHaveURL(/#\/case\//)
})

test('every case has a full case view reachable from the page', async ({ page }) => {
  await page.goto('./?3d=off')
  const links = page.getByRole('link', { name: /^Read the full case/ })
  await expect(links).toHaveCount(5)

  await links.nth(4).click()
  await expect(page.getByRole('dialog', { name: 'Logistics web platform' })).toBeVisible()
  await expect(
    page.getByText('Client name, product and screenshots are under NDA.').last(),
  ).toBeVisible()
})

test('screenshots open in the lightbox and can be browsed', async ({ page }) => {
  await page.goto('./?3d=off')
  await page.getByRole('button', { name: /^Open screenshot 1 of 2: Distance and duration/ }).click()

  const lightbox = page.getByRole('dialog', { name: 'MileMaker Excel Add-in' })
  await expect(lightbox).toBeVisible()
  await expect(lightbox.getByText('1 / 2')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(lightbox.getByText('2 / 2')).toBeVisible()
  await expect(lightbox.getByText('Microsoft Marketplace listing')).toBeVisible()
})

test('2D fallback has no canvas and keeps the ecosystem map readable', async ({ page }) => {
  await page.goto('./?3d=off')
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Ecosystem' })).toBeVisible()
  await expect(page.getByText('Different client, separate system').first()).toBeAttached()
})

test('no horizontal scrolling', async ({ page }) => {
  await page.goto('./?3d=off')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test('desktop: the 3D scene loads after the page and drives the case tour', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'phones get the 2D site')
  await page.goto('./')
  const webgl = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'))
  test.skip(!webgl, 'this browser has no WebGL')

  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15_000 })
  await expect(page.locator('[data-case]')).toHaveCount(5)
})
