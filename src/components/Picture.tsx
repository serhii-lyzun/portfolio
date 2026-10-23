import type { Picture as PictureData } from '@/content/types'

type Props = {
  picture: PictureData
  alt: string
  /** Rendered width hint for the browser's srcset choice */
  sizes?: string
  className?: string
  imgClassName?: string
  priority?: boolean
}

// AVIF first, then WebP; the browser takes the first type it supports.
const FORMAT_ORDER = ['avif', 'webp']

/** Responsive <picture> for `?picture` imports (see vite.config.ts). */
export function Picture({
  picture,
  alt,
  sizes = '100vw',
  className,
  imgClassName,
  priority,
}: Props) {
  const sources = Object.entries(picture.sources).sort(
    ([a], [b]) => FORMAT_ORDER.indexOf(a) - FORMAT_ORDER.indexOf(b),
  )

  return (
    <picture className={className}>
      {sources.map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={picture.img.src}
        width={picture.img.w}
        height={picture.img.h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  )
}
