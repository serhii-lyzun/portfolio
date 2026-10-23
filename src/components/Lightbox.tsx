import { useEffect, useState } from 'react'
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

/** Fullscreen screenshot viewer: arrows / ← → to browse, zoom to see real size, Esc to close. */
export function Lightbox({ images, index, onIndexChange, title }: Props) {
  const [zoomed, setZoomed] = useState(false)
  const open = index !== null
  const current = open ? images[index] : undefined
  const many = images.length > 1

  const go = (step: number) => {
    if (index === null) return
    setZoomed(false)
    onIndexChange((index + step + images.length) % images.length)
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
              'relative min-h-0 flex-1 rounded-lg bg-night-900',
              zoomed ? 'overflow-auto' : 'flex items-center justify-center overflow-hidden',
            )}
          >
            <Picture
              picture={current.picture}
              alt={current.alt}
              sizes="96vw"
              className={cn(!zoomed && 'contents')}
              imgClassName={cn(
                'rounded-md',
                zoomed ? 'max-w-none' : 'max-h-full max-w-full object-contain',
              )}
            />
          </div>
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
