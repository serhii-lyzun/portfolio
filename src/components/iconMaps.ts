import type { JSX, SVGProps } from 'react'
import {
  BookOpen,
  Bot,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Globe,
  Lock,
  Mail,
  Map,
  Package,
  Sparkles,
  Store,
  type LucideIcon,
} from 'lucide-react'
import type { CaseLinkKind, CaseSlug, ContactLink } from '@/content/types'
import { GitHubIcon, LinkedInIcon } from './icons'

type IconProps = SVGProps<SVGSVGElement>
type AnyIcon = LucideIcon | ((props: IconProps) => JSX.Element)

export const caseIcons: Record<CaseSlug, LucideIcon> = {
  'excel-add-in': FileSpreadsheet,
  'stripe-billing': CreditCard,
  'ai-mcp': Bot,
  'map-sdk': Map,
  'agentic-engineering': Sparkles,
  'nda-logistics': Lock,
}

export const linkIcons: Record<CaseLinkKind, LucideIcon> = {
  live: Globe,
  marketplace: Store,
  npm: Package,
  docs: BookOpen,
}

export const contactIcons: Record<ContactLink['kind'], AnyIcon> = {
  email: Mail,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  cv: FileText,
}
