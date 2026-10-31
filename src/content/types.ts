// Content model for the portfolio.
// The UI decides how to present a case only from `links` and `media[].kind`.

export type Picture = {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

export type ScreenshotMedia = {
  kind: 'screenshot'
  picture: Picture
  alt: string
  /** What this shows (short; also the label in the browser-window frame) */
  caption?: string
  /** My part in what the screenshot shows */
  contribution?: string
  /** Why it mattered */
  why?: string
}

export type DiagramMedia = {
  kind: 'diagram'
  /** `id` is referenced by `edges`; the first node is where the flow starts */
  nodes: { id: string; label: string; detail?: string }[]
  edges: [from: string, to: string][]
  caption?: string
}

export type CaseMedia = ScreenshotMedia | DiagramMedia

export type CaseLinkKind = 'live' | 'marketplace' | 'npm' | 'docs'

export type CaseLink = {
  label: string
  href: string
  kind: CaseLinkKind
}

export type CaseSlug =
  'excel-add-in' | 'stripe-billing' | 'ai-mcp' | 'map-sdk' | 'agentic-engineering' | 'nda-logistics'

export type CaseStudy = {
  slug: CaseSlug
  /** The featured case: biggest node, first in the tour */
  featured?: boolean
  title: string
  /** One line under the title */
  tagline: string
  company: string
  role: string
  /** My part in this case, separate from the team's result */
  contribution: string
  /** Who built it, e.g. "Me + 1 Senior Frontend Engineer" */
  team: string
  /** Short ownership tag for the ecosystem map and 3D labels, e.g. "Led · team of 2" */
  ownership: string
  period: string
  stack: string[]
  nda?: boolean
  /** Shown as a quote above the STAR blocks for NDA cases */
  ndaNote?: string
  star: {
    situation: string
    task: string
    action: string[]
    result: string[]
  }
  /** Extended detail for the deep-dive view only */
  deepDive?: {
    approach: { title: string; text: string }[]
    hardestPart?: string
    whatItShows?: string
  }
  links: CaseLink[]
  media: CaseMedia[]
  /** Short proof shown on the cursor pointer-line label, e.g. "+2 B2B customers" */
  headlineMetric: string
  /** Big numbers on the case card */
  metrics: { value: string; label: string }[]
  /** 3D constellation placement */
  node: {
    color: string
    size: number
    /**
     * Place on a tilted ring around the API core (or around `anchor`, e.g. the NDA cluster):
     * `phase` = home angle (rad), `tilt` = vertical squash, `speed` = sway frequency.
     */
    orbit: { radius: number; speed: number; phase: number; tilt: number }
    anchor?: [x: number, y: number, z: number]
  }
}

export type Metric = {
  /** Number animated by the count-up (e.g. 8 in "8+"), or a short text shown as is */
  value: number | string
  prefix?: string
  suffix?: string
  label: string
  /** Where the number comes from or how it is defined */
  note?: string
}

export type MetricGroup = {
  title: string
  /** Shown next to the group title, e.g. "my estimates" */
  qualifier?: string
  metrics: Metric[]
}

export type ContactLink = {
  label: string
  href: string
  kind: 'email' | 'linkedin' | 'github' | 'cv'
}

export type Profile = {
  name: string
  headline: string
  domain: string
  summary: string
  facts: string[]
  location: string
  availability: string
  email: string
  contacts: ContactLink[]
  cvUrl: string
  photo: Picture
  photoAlt: string
  /** Impact numbers, grouped: scope, business outcomes, engineering outcomes, delivery */
  metrics: MetricGroup[]
}

export type LeadershipStory = {
  title: string
  story: string
  proof: string
  /** How the proof was measured, when it is an estimate */
  proofNote?: string
}

export type Credential = {
  title: string
  issuer: string
  date: string
}

export type Testimonial = {
  /** Verbatim from LinkedIn; paragraphs as separate strings */
  quote: string[]
  name: string
  /** Their role, as on their LinkedIn headline */
  role: string
  company?: string
  /** How they worked with Serhii, as LinkedIn states it */
  relation: string
  /** Pull quote for the featured card: a sentence copied verbatim from `quote` */
  highlight?: string
  /** Date given, ISO (YYYY-MM-DD) */
  date: string
  href?: string
}

/** Context satellites in the constellation that are not cases themselves */
export type EcosystemNode = {
  id: string
  label: string
  kind: 'core' | 'service' | 'channel'
  connectsTo: string[]
}
