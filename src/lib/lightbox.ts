import { useSyncExternalStore } from 'react'
import type { ScreenshotMedia } from '@/content/types'

/** Page-level lightbox that both the 3D screenshot cards and plain buttons can open. */
export type LightboxState = { images: ScreenshotMedia[]; title: string; index: number | null }

let state: LightboxState = { images: [], title: '', index: null }
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const lightbox = {
  get: () => state,
  open(images: ScreenshotMedia[], index: number, title: string) {
    state = { images, title, index }
    emit()
  },
  setIndex(index: number | null) {
    state = { ...state, index }
    emit()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export const useLightbox = () =>
  useSyncExternalStore(lightbox.subscribe, lightbox.get, lightbox.get)
