import photo from '@/assets/photo/serhii-lyzun.jpg?picture'
import type { Credential, Profile } from './types'

/** Opens in a new tab with the browser's PDF preview */
export const CV_URL = `${import.meta.env.BASE_URL}cv/Serhii_Lyzun_Senior_Full_Stack_Engineer.pdf`

export const profile: Profile = {
  name: 'Serhii Lyzun',
  // Must match the CV headline and LinkedIn
  headline: 'Senior Full-Stack Engineer (React / Node.js)',
  domain: 'Logistics & route planning',
  summary:
    'I build web apps, Node.js services, npm SDKs, Office Add-ins and AI/MCP tools, and I lead the teams that ship them.',
  facts: ['9+ years', '15+ products launched', 'Teams of 1–5'],
  location: 'Ukraine',
  availability: 'Open to Remote & Relocation (EU, USA)',
  email: 'serhii.lyzun@gmail.com',
  contacts: [
    { kind: 'email', label: 'serhii.lyzun@gmail.com', href: 'mailto:serhii.lyzun@gmail.com' },
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/serhii-lyzun' },
    { kind: 'github', label: 'GitHub', href: 'https://github.com/serhii-lyzun' },
    { kind: 'cv', label: 'CV (PDF)', href: CV_URL },
  ],
  cvUrl: CV_URL,
  photo,
  photoAlt: 'Portrait of Serhii Lyzun',
  metrics: [
    {
      title: 'Scope',
      metrics: [
        {
          value: 15,
          suffix: '+',
          label: 'Products launched',
          note: 'Separate products, not releases or features',
        },
        { value: '1–5', label: 'People in the teams I lead', note: 'Team lead and mentor' },
        {
          value: 4,
          label: 'MileMaker sub-systems are mine',
          note: 'Of the platform’s 8+: 2 I led, 2 I built on my own',
        },
      ],
    },
    {
      title: 'Business outcomes',
      metrics: [
        {
          value: 2,
          prefix: '+',
          label: 'Major B2B customers the Excel Add-in helped land',
          note: 'Confirmed by the client',
        },
        {
          value: 5,
          prefix: '+',
          suffix: '%',
          label: 'New B2C customers per year after Stripe billing',
          note: 'Confirmed by the client',
        },
        {
          value: 'Fewer hires',
          label: 'Needed by the client thanks to AI tooling for developers',
          note: 'Confirmed by the client',
        },
      ],
    },
    {
      title: 'Engineering outcomes',
      qualifier: 'my estimates',
      metrics: [
        {
          value: 30,
          prefix: '+',
          suffix: '%',
          label: 'Team productivity',
          note: 'Story points per sprint with me as team lead vs. periods without one',
        },
        {
          value: 40,
          prefix: '+',
          suffix: '%',
          label: 'Delivery speed with AI tooling',
          note: 'Comparable user stories, full cycle, with Claude Code vs. without',
        },
      ],
    },
    {
      title: 'Delivery example',
      metrics: [
        {
          value: 2,
          suffix: ' days',
          label: 'Custom route-avoidance feature for the client',
        },
      ],
    },
  ],
}

// Source: CV "Courses & Certifications"
export const credentials: Credential[] = [
  { title: 'Agentic Engineering Course', issuer: 'SULICOM AI Academy', date: 'September 2026' },
  { title: 'React.js/Redux Advanced Course', issuer: 'Mate Academy, Kyiv', date: '2018' },
]
