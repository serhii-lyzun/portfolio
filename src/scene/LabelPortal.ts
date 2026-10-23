import { createContext, useContext, type RefObject } from 'react'

/**
 * Where drei <Html> labels mount. Without it they mount into the event source (the app root)
 * and float above the whole page instead of sitting in the backdrop layer with the canvas.
 */
export const LabelPortalContext = createContext<RefObject<HTMLElement> | undefined>(undefined)

export const useLabelPortal = () => useContext(LabelPortalContext)
