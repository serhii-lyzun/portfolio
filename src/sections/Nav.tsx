import { Menu } from 'lucide-react'
import { CvButton } from '@/components/CvButton'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { profile } from '@/content/profile'
import { testimonials } from '@/content/testimonials'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#cases', label: 'Cases' },
  { href: '#ecosystem', label: 'Ecosystem' },
  { href: '#leadership', label: 'How I lead' },
  // The section only renders once there are recommendations
  ...(testimonials.length > 0 ? [{ href: '#testimonials', label: 'Recommendations' }] : []),
  { href: '#contact', label: 'Contact' },
]

/** Sticky top nav: hides on scroll down, returns on scroll up. */
export function Nav() {
  const { hidden, scrolled } = useScrollDirection()

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color] duration-300 motion-reduce:transition-none',
        hidden && '-translate-y-full',
        scrolled
          ? 'border-b border-ink/10 bg-night-950/80 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6"
      >
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          {profile.name}
        </a>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-sm whitespace-nowrap text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <CvButton variant="primary" className="ml-auto min-h-10 py-2 lg:ml-0" magnetic />

        <Sheet>
          <SheetTrigger
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink/20 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="top" className="border-ink/10 bg-night-950 px-4 pt-16 pb-8">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Jump to a section</SheetDescription>
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <SheetClose asChild>
                    <a href={link.href} className="block py-3 font-display text-2xl font-bold">
                      {link.label}
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
