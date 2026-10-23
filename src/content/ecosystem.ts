// Context satellites of the constellation: the shared API core and the services/channels
// around it that are not cases themselves.
import type { CaseSlug, EcosystemNode } from './types'

export const CORE_ID = 'api'

export const ecosystem: EcosystemNode[] = [
  { id: CORE_ID, label: 'Node.js API', kind: 'core', connectsTo: [] },
  { id: 'web', label: 'Web App', kind: 'channel', connectsTo: [CORE_ID] },
  { id: 'here', label: 'HERE Maps', kind: 'service', connectsTo: [CORE_ID] },
  { id: 'llm', label: 'LLM APIs', kind: 'service', connectsTo: ['ai-mcp'] },
  {
    id: 'marketplace',
    label: 'Microsoft Marketplace',
    kind: 'channel',
    connectsTo: ['excel-add-in'],
  },
  { id: 'npm', label: 'npm', kind: 'channel', connectsTo: ['map-sdk'] },
  { id: 'stripe', label: 'Stripe', kind: 'service', connectsTo: ['stripe-billing'] },
]

/** Cases wired to the shared API core. The NDA case is a different client, so it floats apart. */
export const coreConnectedCases: CaseSlug[] = [
  'excel-add-in',
  'stripe-billing',
  'ai-mcp',
  'map-sdk',
]
