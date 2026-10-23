import { defineConfig, devices } from '@playwright/test'

// Smoke tests against the production build, served like GitHub Pages under /portfolio/.
const PORT = 4173

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/portfolio/`,
    trace: 'retain-on-failure',
  },
  projects: [
    // Desktop path: 2D forced with ?3d=off where a test needs it (headless WebGL varies by machine)
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    // Phone path: the static case grid, no WebGL
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    // Cross-browser: Firefox and Safari's engine on desktop, Safari on iPhone
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'iphone', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/portfolio/`,
    reuseExistingServer: !process.env.CI,
  },
})
