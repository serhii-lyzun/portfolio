// Source: home-work-lesson-29.md (header + metrics) and the Senior Full-Stack master CV.
import photo from '@/assets/photo/serhii-lyzun.jpg?picture'
import type { Credential, Profile } from './types'

/** Opens in a new tab with the browser's PDF preview (plan D6) */
export const CV_URL = `${import.meta.env.BASE_URL}cv/Serhii_Lyzun_Senior_Full_Stack_Engineer.pdf`

export const profile: Profile = {
  name: 'Serhii Lyzun',
  // Must match the CV headline and LinkedIn (Lesson 29)
  headline: 'Senior Full-Stack Engineer (React / Node.js)',
  domain: 'Logistics & route planning',
  summary:
    'I build and scale product ecosystems end to end: web apps, Node.js services, npm SDKs, Office Add-ins and AI/MCP tools. I also lead the teams that ship them.',
  facts: ['9+ years', '15+ launches', 'Teams of 5–15'],
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
    { value: 8, suffix: '+', label: 'Sub-systems built for one platform' },
    { value: 2, label: 'New major B2B customers via the Excel Add-in' },
    { value: 5, prefix: '+', suffix: '%', label: 'New B2C customers per year via Stripe billing' },
    {
      value: 30,
      prefix: '+',
      suffix: '%',
      label: 'Team productivity after code-quality standards',
    },
    {
      value: 40,
      prefix: '+',
      suffix: '%',
      label: 'Delivery speed with Claude Code, Skills & Agents',
    },
  ],
}

// Source: CV "Courses & Certifications"
export const credentials: Credential[] = [
  { title: 'Agentic Engineering Course', issuer: 'SULICOM AI Academy', date: 'September 2026' },
  { title: 'React.js/Redux Advanced Course', issuer: 'Mate Academy, Kyiv', date: '2018' },
]
