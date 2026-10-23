// schema.org JSON-LD for search engines, built from the same content as the page
// and injected into <head> by the prerender (scripts/prerender.mjs).
import { profile } from './profile'

export const SITE_URL = 'https://serhii-lyzun.github.io/portfolio/'

const sameAs = profile.contacts
  .filter((c) => c.kind === 'linkedin' || c.kind === 'github')
  .map((c) => c.href)

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: SITE_URL,
  name: `${profile.name} — ${profile.headline}`,
  mainEntity: {
    '@type': 'Person',
    name: profile.name,
    jobTitle: 'Senior Full-Stack Engineer',
    description: profile.summary,
    url: SITE_URL,
    image: `${SITE_URL}og-image.jpg`,
    email: `mailto:${profile.email}`,
    sameAs,
    address: { '@type': 'PostalAddress', addressCountry: 'UA' },
    worksFor: { '@type': 'Organization', name: 'Intellias' },
    knowsAbout: [
      'React',
      'Node.js',
      'TypeScript',
      'Office Add-ins',
      'Stripe billing',
      'Model Context Protocol (MCP)',
      'LLM APIs',
      'HERE Maps',
      'Logistics and route planning',
    ],
  },
}

/** `<script type="application/ld+json">` tag, safe to inline in HTML */
export function structuredDataTag() {
  const json = JSON.stringify(structuredData).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}
