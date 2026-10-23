import { useState, type CSSProperties } from 'react'
import { Maximize2 } from 'lucide-react'
import type { ScreenshotMedia } from '@/content/types'
import { cn } from '@/lib/utils'
import { Lightbox } from './Lightbox'
import { Picture } from './Picture'

type Props = {
  images: ScreenshotMedia[]
  /** Case title, used for the lightbox heading */
  title: string
  sizes?: string
  className?: string
}

/**
 * Screenshots as a fanned stack of browser windows. Hover/focus spreads the cards;
 * click opens the lightbox on that screenshot. The 3D version of this lives in the scene.
 */
export function CardStack({
  images,
  title,
  sizes = '(min-width: 1024px) 40vw, 90vw',
  className,
}: Props) {
  const [open, setOpen] = useState<number | null>(null)
  if (images.length === 0) return null

  // Centre offset of each card: 1 card → [0], 2 → [-0.5, 0.5], 3 → [-1, 0, 1]
  const offset = (i: number) => i - (images.length - 1) / 2

  return (
    <>
      <div
        className={cn(
          'group relative aspect-[16/10] w-full',
          images.length > 1 && 'px-[8%]',
          className,
        )}
      >
        {images.map((image, i) => (
          <button
            key={image.picture.img.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open screenshot ${i + 1} of ${images.length}: ${image.caption ?? image.alt}`}
            style={{ '--o': offset(i), zIndex: images.length - i } as CSSProperties}
            className={cn(
              'absolute inset-y-0 overflow-hidden rounded-xl border border-ink/10 bg-night-800 text-left shadow-2xl shadow-black/50',
              'transition-transform duration-500 ease-out motion-reduce:transition-none',
              images.length > 1 ? 'inset-x-[8%]' : 'inset-x-0',
              // Resting: slightly fanned. Hover / keyboard focus: spread apart, front card lifts.
              '[transform:translateX(calc(var(--o)*5%))_rotate(calc(var(--o)*2.5deg))]',
              'group-hover:[transform:translateX(calc(var(--o)*10%))_rotate(calc(var(--o)*4deg))]',
              'group-has-focus-visible:[transform:translateX(calc(var(--o)*10%))_rotate(calc(var(--o)*4deg))]',
              'hover:z-50! focus-visible:z-50!',
            )}
          >
            <BrowserBar label={image.caption} />
            <Picture
              picture={image.picture}
              alt=""
              sizes={sizes}
              imgClassName="h-full w-full object-cover object-top"
              className="block h-[calc(100%-1.75rem)]"
            />
            <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-night-950/80 px-3 py-1 text-xs text-ink opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="size-3.5" aria-hidden />
              Zoom
            </span>
          </button>
        ))}
      </div>
      <Lightbox images={images} index={open} onIndexChange={setOpen} title={title} />
    </>
  )
}

function BrowserBar({ label }: { label?: string }) {
  return (
    <span className="flex h-7 items-center gap-1.5 border-b border-ink/10 bg-night-900 px-3">
      <span className="size-2 rounded-full bg-coral/70" />
      <span className="size-2 rounded-full bg-amber-300/70" />
      <span className="size-2 rounded-full bg-emerald-400/70" />
      {label && (
        <span className="ml-3 truncate rounded bg-night-800 px-2 text-[10px] leading-4 text-ink-muted">
          {label}
        </span>
      )}
    </span>
  )
}
