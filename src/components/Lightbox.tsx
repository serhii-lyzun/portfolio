import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { ScreenshotMedia } from '@/content/types'
import { cn } from '@/lib/utils'
import { Picture } from './Picture'

type Props = {
  images: ScreenshotMedia[]
  index: number | null
  onIndexChange: (index: number | null) => void
  title: string
}

/** How the current screenshot enters: rises in on open, swings in from the side when browsing */
type Entry = 'open' | 'next' | 'prev'

/**
 * Fullscreen screenshot viewer: arrows / ← → / swipe / thumbnails to browse, zoom to see real
 * size, Esc to close.
 */
export function Lightbox({ images, index, onIndexChange, title }: Props) {
  const [zoomed, setZoomed] = useState(false)
  const [entry, setEntry] = useState<Entry>('open')
  const swipeStart = useRef<number | null>(null)
  const open = index !== null
  const current = open ? images[index] : undefined
  const many = images.length > 1

  const show = (next: number, direction: Entry) => {
    setZoomed(false)
    setEntry(direction)
    onIndexChange(next)
  }
  const go = (step: number) => {
    if (index === null) return
    show((index + step + images.length) % images.length, step > 0 ? 'next' : 'prev')
  }

  useEffect(() => {
    if (!open || !many) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setZoomed(false)
          setEntry('open')
          onIndexChange(null)
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).focus({ preventScroll: true })
        }}
        className="flex h-[92svh] w-[96vw] max-w-[96vw] flex-col gap-3 border-ink/10 bg-night-950/95 p-3 sm:max-w-[min(96vw,1440px)] sm:p-4"
      >
        <div className="flex items-center gap-3 pr-10">
          <DialogTitle className="truncate font-display text-base">{title}</DialogTitle>
          {many && (
            <span className="shrink-0 text-sm text-ink-muted tabular-nums">
              {(index ?? 0) + 1} / {images.length}
            </span>
          )}
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="ml-auto inline-flex size-9 items-center justify-center rounded-full text-ink-muted hover:bg-night-800 hover:text-ink"
            aria-label={zoomed ? 'Fit to screen' : 'Show real size'}
            aria-pressed={zoomed}
          >
            {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
          </button>
        </div>

        {current && (
          <div
            className={cn(
              'relative min-h-0 flex-1 rounded-lg bg-night-900 perspective-[1400px]',
              zoomed ? 'overflow-auto' : 'overflow-hidden',
            )}
            onPointerDown={(e) => {
              if (e.pointerType !== 'mouse' && !zoomed) swipeStart.current = e.clientX
            }}
            onPointerUp={(e) => {
              if (swipeStart.current === null) return
              const dx = e.clientX - swipeStart.current
              swipeStart.current = null
              if (many && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
            }}
          >
            {/* Keyed by index: every screenshot mounts fresh and plays its entry animation */}
            <div
              key={index}
              className={cn(
                `shot-${entry}`,
                zoomed ? 'w-max' : 'flex size-full items-center justify-center p-2 sm:p-4',
              )}
            >
              <Picture
                picture={current.picture}
                alt={current.alt}
                sizes="96vw"
                className={cn(!zoomed && 'contents')}
                imgClassName={cn(
                  'rounded-md shadow-[0_20px_80px_-20px_rgb(63_224_232/0.35)]',
                  zoomed ? 'max-w-none' : 'max-h-full max-w-full object-contain',
                )}
              />
            </div>
            {!zoomed && <span aria-hidden key={`shine-${index}`} className="shot-shine" />}
          </div>
        )}

        {many && (
          <ul className="flex justify-center gap-2" aria-label="Screenshots">
            {images.map((image, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => i !== index && show(i, i > (index ?? 0) ? 'next' : 'prev')}
                  aria-label={`Show screenshot ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'block h-12 w-20 overflow-hidden rounded-md border transition-all duration-300 sm:h-14 sm:w-24',
                    i === index
                      ? 'scale-105 border-cyan opacity-100 shadow-[0_0_20px_rgb(63_224_232/0.35)]'
                      : 'border-ink/15 opacity-50 hover:opacity-90',
                  )}
                >
                  <Picture
                    picture={image.picture}
                    alt=""
                    sizes="96px"
                    className="contents"
                    imgClassName="size-full object-cover object-top"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3">
          {many && (
            <button
              type="button"
              onClick={() => go(-1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15 hover:border-cyan hover:text-cyan"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          <DialogDescription className="flex-1 text-center text-sm text-ink-muted">
            {current?.caption ?? current?.alt}
          </DialogDescription>
          {many && (
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15 hover:border-cyan hover:text-cyan"
              aria-label="Next screenshot"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
