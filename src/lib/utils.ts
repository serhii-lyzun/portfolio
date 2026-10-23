import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Domain shown next to case links so recruiters see where they lead, e.g. "npmjs.com" */
export const domainOf = (href: string) => new URL(href).hostname.replace(/^www\./, '')
