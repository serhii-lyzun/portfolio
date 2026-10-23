import { FileText } from 'lucide-react'
import { profile } from '@/content/profile'
import { LinkButton } from './LinkButton'

type Props = {
  variant?: 'primary' | 'outline'
  className?: string
  label?: string
  magnetic?: boolean
}

/** Opens the Senior Full-Stack CV PDF in a new tab with the browser's PDF preview. */
export function CvButton({ variant = 'outline', className, label = 'CV', magnetic }: Props) {
  return (
    <LinkButton
      href={profile.cvUrl}
      external
      variant={variant}
      className={className}
      magnetic={magnetic}
      cursor="Open CV ↗"
      icon={<FileText className="size-4" aria-hidden />}
    >
      {label}
    </LinkButton>
  )
}
