// Shape of `import x from './image.png?picture'` (vite-imagetools `as=picture`), see vite.config.ts.
declare module '*?picture' {
  const picture: {
    /** srcset string per format, e.g. { avif: 'a.avif 600w, b.avif 1200w', webp: '…' } */
    sources: Record<string, string>
    /** fallback image (largest WebP) with its intrinsic size */
    img: { src: string; w: number; h: number }
  }
  export default picture
}
