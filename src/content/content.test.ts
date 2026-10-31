// Guards the portfolio content rules and data integrity, so content edits can't break the site.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { cases, featuredCase } from './cases'
import { CORE_ID, coreConnectedCases, ecosystem } from './ecosystem'
import { leadership } from './leadership'
import { CV_URL, profile } from './profile'
import { SITE_URL, structuredData, structuredDataTag } from './structuredData'
import { testimonials } from './testimonials'

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url))

describe('profile', () => {
  it('has the must-haves: name, headline, domain, contacts, CV', () => {
    expect(profile.name).toBe('Serhii Lyzun')
    expect(profile.headline).toBe('Senior Full-Stack Engineer (React / Node.js)')
    expect(profile.domain).not.toBe('')
    const kinds = profile.contacts.map((c) => c.kind)
    expect(kinds).toEqual(expect.arrayContaining(['email', 'linkedin', 'github', 'cv']))
  })

  it('links to a CV PDF that exists in public/', () => {
    const file = CV_URL.replace(import.meta.env.BASE_URL, '')
    expect(file).toMatch(/\.pdf$/)
    expect(existsSync(publicDir + file)).toBe(true)
  })

  it('has an optimised portrait with alt text', () => {
    expect(Object.keys(profile.photo.sources)).toEqual(expect.arrayContaining(['avif', 'webp']))
    expect(profile.photoAlt).not.toBe('')
  })

  it('groups impact numbers into scope, business, engineering and a delivery example', () => {
    expect(profile.metrics.map((g) => g.title)).toEqual([
      'Scope',
      'Business outcomes',
      'Engineering outcomes',
      'Delivery example',
    ])
  })

  it('says where every outcome number comes from', () => {
    const outcomes = profile.metrics.filter((g) => g.title.endsWith('outcomes'))
    for (const m of outcomes.flatMap((g) => g.metrics)) expect(m.note, m.label).toBeTruthy()
    // Estimates are labelled as estimates
    expect(profile.metrics.find((g) => g.title === 'Engineering outcomes')?.qualifier).toBe(
      'my estimates',
    )
  })
})

describe('cases', () => {
  it('has the 6 commercial cases with unique slugs', () => {
    expect(cases).toHaveLength(6)
    expect(new Set(cases.map((c) => c.slug)).size).toBe(cases.length)
  })

  it('features exactly one case, the Excel Add-in, first in the tour', () => {
    expect(cases.filter((c) => c.featured)).toHaveLength(1)
    expect(featuredCase.slug).toBe('excel-add-in')
    expect(cases[0]).toBe(featuredCase)
  })

  it.each(cases)('$slug has a full STAR description', ({ star }) => {
    expect(star.situation).not.toBe('')
    expect(star.task).not.toBe('')
    expect(star.action.length).toBeGreaterThan(0)
    expect(star.result.length).toBeGreaterThan(0)
  })

  it.each(cases)('$slug separates my contribution from the team result', (c) => {
    expect(c.contribution).not.toBe('')
    expect(c.team).not.toBe('')
    expect(c.ownership).not.toBe('')
  })

  it.each(cases)('$slug explains each screenshot: what it shows, my part, why it mattered', (c) => {
    for (const m of c.media)
      if (m.kind === 'screenshot') {
        expect(m.caption, c.slug).toBeTruthy()
        expect(m.contribution, c.slug).toBeTruthy()
        expect(m.why, c.slug).toBeTruthy()
      }
  })

  it.each(cases)('$slug has a link and/or a visual', ({ links, media }) => {
    expect(links.length + media.length).toBeGreaterThan(0)
  })

  it.each(cases)('$slug uses https links', ({ links }) => {
    for (const link of links) expect(link.href).toMatch(/^https:\/\//)
  })

  it.each(cases)('$slug screenshots have alt text and AVIF/WebP sources', ({ media }) => {
    for (const m of media) {
      if (m.kind !== 'screenshot') continue
      expect(m.alt.length).toBeGreaterThan(20)
      expect(Object.keys(m.picture.sources)).toEqual(expect.arrayContaining(['avif', 'webp']))
    }
  })

  it.each(cases)('$slug diagram edges point to existing nodes', ({ media }) => {
    for (const m of media) {
      if (m.kind !== 'diagram') continue
      const ids = new Set(m.nodes.map((n) => n.id))
      for (const [from, to] of m.edges) {
        expect(ids.has(from)).toBe(true)
        expect(ids.has(to)).toBe(true)
      }
    }
  })

  it('keeps NDA cases free of links and screenshots', () => {
    for (const c of cases.filter((c) => c.nda)) {
      expect(c.links).toHaveLength(0)
      expect(c.media.every((m) => m.kind !== 'screenshot')).toBe(true)
      expect(c.ndaNote).toBeTruthy()
    }
  })
})

describe('ecosystem', () => {
  const validIds = new Set([...ecosystem.map((n) => n.id), ...cases.map((c) => c.slug)])

  it('has exactly one core', () => {
    expect(ecosystem.filter((n) => n.kind === 'core').map((n) => n.id)).toEqual([CORE_ID])
  })

  it('only connects to known nodes', () => {
    for (const node of ecosystem)
      for (const id of node.connectsTo) expect(validIds.has(id)).toBe(true)
  })

  it('does not wire the NDA case to the shared API core', () => {
    const nda = cases.filter((c) => c.nda).map((c) => c.slug)
    expect(coreConnectedCases.some((s) => nda.includes(s))).toBe(false)
  })
})

describe('leadership', () => {
  it('backs every story with proof', () => {
    for (const s of leadership) expect(s.proof).not.toBe('')
  })
})

describe('testimonials', () => {
  it('names who said it, how they worked with Serhii and when', () => {
    for (const t of testimonials) {
      expect(t.quote.length, t.name).toBeGreaterThan(0)
      expect(
        t.quote.every((p) => p.trim().length > 0),
        t.name,
      ).toBe(true)
      expect(t.role && t.relation, t.name).toBeTruthy()
      if (t.highlight) expect(t.quote.join(' '), t.name).toContain(t.highlight)
      expect(t.date, t.name).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

describe('structured data (JSON-LD)', () => {
  it('describes the person behind the page with absolute https URLs', () => {
    const person = structuredData.mainEntity
    expect(person.name).toBe(profile.name)
    expect(person.url).toBe(SITE_URL)
    for (const url of [person.url, person.image, ...person.sameAs])
      expect(url).toMatch(/^https:\/\//)
  })

  it('points its image at the link-preview file in public/', () => {
    const file = structuredData.mainEntity.image.replace(SITE_URL, '')
    expect(existsSync(publicDir + file)).toBe(true)
  })

  it('is valid JSON that cannot close its own <script> tag', () => {
    const tag = structuredDataTag()
    const json = tag.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '')
    expect(json).not.toContain('<')
    expect(JSON.parse(json)['@type']).toBe('ProfilePage')
  })
})
