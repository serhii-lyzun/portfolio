/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

// Responsive widths per image folder; `?picture` imports become AVIF + WebP srcsets.
const pictureWidths = (id: string) => (id.includes('/assets/photo/') ? '400;800' : '600;900;1200')

// https://vite.dev/config/
export default defineConfig({
  // Served from https://serhii-lyzun.github.io/portfolio/
  base: '/portfolio/',
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: (url) =>
        url.searchParams.has('picture')
          ? new URLSearchParams({
              w: pictureWidths(url.pathname),
              format: 'avif;webp',
              withoutEnlargement: 'true',
              as: 'picture',
            })
          : new URLSearchParams(),
    }),
  ],
  build: {
    // The lazy 3D chunk (three.js + R3F) is ~1 MB minified; its real budget is gzipped size,
    // enforced by scripts/check-size.mjs
    chunkSizeWarningLimit: 1100,
  },
  test: {
    // Unit tests only; Playwright specs in e2e/ run with `npm run e2e`
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
