import { lightbox, useLightbox } from '@/lib/lightbox'
import { Lightbox } from './Lightbox'

/** Renders the page-level lightbox (opened from the 3D tour and the tour cards). */
export function GlobalLightbox() {
  const { images, title, index } = useLightbox()
  return <Lightbox images={images} index={index} onIndexChange={lightbox.setIndex} title={title} />
}
