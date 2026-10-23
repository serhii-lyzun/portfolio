import { FileText } from 'lucide-react'
import { profile } from '@/content/profile'
import { LinkButton } from './LinkButton'

type Props = { variant?: 'primary' | 'outline'; className?: string; label?: string }

/** Opens the Senior Full-Stack CV PDF in a new tab with the browser's PDF preview (plan § 2.3). */
export function CvButton({ variant = 'outline', className, label = 'CV' }: Props) {
  return (
    <LinkButton
      href={profile.cvUrl}
      external
      variant={variant}
      className={className}
      icon={<FileText className="size-4" aria-hidden />}
    >
      {label}
    </LinkButton>
  )
}
