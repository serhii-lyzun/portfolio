import { profile } from '@/content/profile'

export function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink-muted sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {__BUILD_YEAR__} {profile.name}
        </p>
        <p>
          Built with React, TypeScript and Tailwind ·{' '}
          <a
            href="https://github.com/serhii-lyzun/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-ink/40 underline-offset-4 hover:text-cyan"
          >
            Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  )
}
