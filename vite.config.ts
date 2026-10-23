import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

// Responsive widths per image folder; `?picture` imports become AVIF + WebP srcsets.
const pictureWidths = (id: string) => (id.includes('/assets/photo/') ? '400;800' : '600;1200')

// https://vite.dev/config/
export default defineConfig({
  // Served from https://serhii-lyzun.github.io/portfolio/
  base: '/portfolio/',
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
