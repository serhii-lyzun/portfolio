import { ArrowUpRight, FileText, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

// M1 placeholder: real content and the 3D constellation arrive in M2–M5 (see PORTFOLIO_SITE_PLAN.md)
const CV_URL = `${import.meta.env.BASE_URL}cv/Serhii_Lyzun_Senior_Full_Stack_Engineer.pdf`
const CASES_URL = 'https://github.com/serhii-lyzun/portfolio/blob/main/home-work-lesson-29.md'

const links = [
  { label: 'CV', href: CV_URL, icon: FileText, primary: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/serhii-lyzun', icon: ArrowUpRight },
  { label: 'GitHub', href: 'https://github.com/serhii-lyzun', icon: ArrowUpRight },
]

export default function App() {
  return (
    <main className="relative flex min-h-svh items-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-cyan/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[30rem] w-[30rem] rounded-full bg-coral/10 blur-3xl"
      />

      <section className="relative mx-auto w-full max-w-4xl">
        <p className="font-display text-sm tracking-[0.3em] text-cyan uppercase">Portfolio</p>
        <h1 className="mt-4 font-display text-5xl leading-tight font-bold sm:text-7xl">
          Serhii Lyzun
        </h1>
        <p className="mt-3 font-display text-xl text-coral sm:text-2xl">
          Senior Full-Stack Engineer (React / Node.js)
        </p>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted">
          9+ years · 15+ launches · teams of 5–15 · domain expertise in logistics &amp; route
          planning. I build and scale product ecosystems end to end: web apps, Node.js services, npm
          SDKs, Office Add-ins and AI/MCP tools.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {links.map(({ label, href, icon: Icon, primary }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors',
                primary
                  ? 'bg-coral text-night-950 hover:bg-coral-soft'
                  : 'border border-ink/20 hover:border-cyan hover:text-cyan',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </a>
          ))}
          <a
            href="mailto:serhii.lyzun@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 font-medium transition-colors hover:border-cyan hover:text-cyan"
          >
            <Mail className="size-4" aria-hidden />
            serhii.lyzun@gmail.com
          </a>
        </div>

        <p className="mt-12 text-sm text-ink-muted">
          The interactive case-study site is being built. Meanwhile, read the{' '}
          <a
            href={CASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan underline-offset-4 hover:underline"
          >
            case studies (STAR)
          </a>
          .
        </p>
      </section>
    </main>
  )
}
