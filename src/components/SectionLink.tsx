import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Copies `text`; falls back to a hidden textarea where the async clipboard API is unavailable */
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.append(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

type Props = { id: string; children: ReactNode; className?: string }

/**
 * Section title as a shareable anchor: a click puts `#id` in the address bar, scrolls the
 * section into place and copies the link (e.g. …/portfolio/#ecosystem).
 */
export function SectionLink({ id, children, className }: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <a
      href={`#${id}`}
      data-cursor={copied ? 'Copied ✓' : 'Copy link'}
      className={cn('group/anchor inline-flex items-center gap-3 decoration-cyan/60', className)}
      onClick={async (e) => {
        e.preventDefault()
        const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`
        window.history.replaceState(null, '', url)
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
        if (await copy(url)) {
          setCopied(true)
          window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setCopied(false), 2000)
        }
      }}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          'inline-flex size-[0.7em] shrink-0 items-center justify-center transition-all duration-200',
          copied
            ? 'text-cyan opacity-100'
            : 'text-ink-muted opacity-0 group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 pointer-coarse:opacity-60',
        )}
      >
        {copied ? <Check className="size-full" /> : <Link2 className="size-full" />}
      </span>
      <span
        role="status"
        className={cn(
          'rounded-full bg-cyan/15 px-3 py-1 font-sans text-xs font-medium tracking-normal text-cyan normal-case transition-all duration-300',
          copied ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0',
        )}
      >
        {copied ? 'Link copied' : ''}
      </span>
    </a>
  )
}
