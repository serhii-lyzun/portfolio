// Guards the Lesson 29 portfolio rules and data integrity, so content edits can't break the site.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { cases, featuredCase } from './cases'
import { CORE_ID, coreConnectedCases, ecosystem } from './ecosystem'
import { leadership } from './leadership'
import { CV_URL, profile } from './profile'

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url))

describe('profile', () => {
  it('has the Lesson 29 must-haves: name, headline, domain, contacts, CV', () => {
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

  it('shows the 5 impact metrics', () => {
    expect(profile.metrics).toHaveLength(5)
  })
})

describe('cases', () => {
  it('has the 5 commercial cases with unique slugs', () => {
    expect(cases).toHaveLength(5)
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

  it.each(cases)('$slug has a link and/or a visual (Lesson 29)', ({ links, media }) => {
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
