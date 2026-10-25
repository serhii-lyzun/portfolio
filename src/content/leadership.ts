// "How I lead": soft skills told as stories.
import type { LeadershipStory } from './types'

export const leadership: LeadershipStory[] = [
  {
    title: 'Small team, fast delivery',
    story:
      'The Excel Add-in was built by a team of 2: a Senior Frontend Engineer and me as team lead, coding about half of my time. I owned the technical design, code reviews and the Marketplace release.',
    proof: 'MVP in 2 sprints, full feature in 4',
  },
  {
    title: 'Code-quality standards',
    story:
      'I lead and mentor teams of 1–5 engineers and set code-quality standards through code reviews and technical guidance.',
    proof: '+30% team productivity',
    proofNote: 'My estimate: story points per sprint with me as team lead vs. periods without one',
  },
  {
    title: 'Stakeholders in the loop',
    story:
      'Stakeholders provided the high-level requirements; we turned them into a working solution and had them validate our demos and finished work at each stage.',
    proof: 'Validated at every stage',
  },
  {
    title: 'Agentic engineering',
    story:
      'I introduced agentic engineering with Claude Code and Claude Skills/Agents as development tools. It also reduced the client’s need for extra hires (confirmed by the client).',
    proof: '+40% delivery speed',
    proofNote: 'My estimate: comparable user stories, full cycle, with AI tooling vs. without',
  },
]
