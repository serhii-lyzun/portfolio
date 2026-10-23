// LinkedIn recommendations, quoted verbatim. The section stays hidden while this
// list is empty.
import type { Testimonial } from './types'

/** Where all recommendations can be read in full */
export const RECOMMENDATIONS_URL =
  'https://www.linkedin.com/in/serhii-lyzun/details/recommendations/'

export const testimonials: Testimonial[] = [
  {
    quote: [
      'Serhii worked with me at Limestone Digital as a Senior Frontend Developer, and he was the kind of engineer every delivery lead wants on a client project. I could hand him a rough spec and get back clean, well-structured React code with the details already thought through. No chasing, no surprises.',
      'Two things stood out. First, code quality: his code went to production almost immediately. He and another senior peer-reviewed each other, and that was the whole quality gate the project needed. Second, how he worked with clients: flexible on scope, direct in communication, focused on what the customer actually needed rather than what was written in the ticket. On one banking project he took a barely defined chatbot concept and turned my technical task into a working front end the client loved.',
      'Self-organized, reliable, a real team player. Seeing him now lead frontend teams and build AI agent tooling does not surprise me at all. I would work with him again tomorrow.',
    ],
    highlight: 'I would work with him again tomorrow.',
    name: 'Nazar Kholboiev',
    role: 'Program & Delivery Management',
    company: 'Limestone Digital',
    relation: 'Managed Serhii directly',
    date: '2026-09-15',
  },
  {
    quote: [
      'We worked together with Serhii on the same project for a few years. He was responsible for the frontend. I was responsible for the backend and the whole technical part of the project. It was a pretty complex project in terms of organisation. The frontend part for me on this project was always a black box. They always took his commitment and came back with awesome results. Serhii, as a team lead, created a stable pipeline for me with results. It was pleasant working together.',
    ],
    name: 'Oleh Herych',
    role: 'Engineering Team Lead',
    relation: 'Worked with Serhii on the same team',
    date: '2026-10-02',
  },
  {
    quote: [
      'Serhii is a very experienced Frontend Development Professionell. He worked for my company as external engineer. He produced great Frontend components and UIs.',
      'Working with him was a treat!',
    ],
    name: 'Christoph Plagemann',
    role: 'Client',
    relation: 'Serhii worked for his company as an external engineer',
    date: '2026-09-12',
  },
]
