// Content model for the portfolio (PORTFOLIO_SITE_PLAN.md § 4.3).
// The UI decides how to present a case only from `links` and `media[].kind` (plan § 3).

export type Picture = {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

export type ScreenshotMedia = {
  kind: 'screenshot'
  picture: Picture
  alt: string
  caption?: string
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

export type CaseSlug = 'excel-add-in' | 'stripe-billing' | 'ai-mcp' | 'map-sdk' | 'nda-logistics'

export type CaseStudy = {
  slug: CaseSlug
  /** The interview "fire" case (Lesson 30): biggest node, first in the tour */
  featured?: boolean
  title: string
  /** One line under the title */
  tagline: string
  company: string
  role: string
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
  /** Extended detail for the deep-dive view only (Lesson 30) */
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
  /** 3D constellation placement (plan § 2) */
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
  /** Numeric part animated by the count-up (e.g. 8 in "8+") */
  value: number
  prefix?: string
  suffix?: string
  label: string
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
  metrics: Metric[]
}

export type LeadershipStory = {
  title: string
  story: string
  proof: string
}

export type Credential = {
  title: string
  issuer: string
  date: string
}

export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  href?: string
}

/** Context satellites in the constellation that are not cases themselves */
export type EcosystemNode = {
  id: string
  label: string
  kind: 'core' | 'service' | 'channel'
  connectsTo: string[]
}
