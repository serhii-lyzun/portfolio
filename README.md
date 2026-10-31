# portfolio

Portfolio of **Serhii Lyzun — Senior Full-Stack Engineer (React / Node.js)**.

**Live:** https://serhii-lyzun.github.io/portfolio/

Six commercial case studies in STAR format (Situation, Task, Action, Result), an ecosystem map, leadership stories and LinkedIn recommendations, presented as an interactive 3D constellation.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Three.js (React Three Fiber + drei) · shadcn/ui

## Develop

Requires Node 22.12+ (`.nvmrc` pins 24).

```sh
nvm use
npm install
npm run dev        # http://localhost:5173/portfolio/
```

| Script | What it does |
|---|---|
| `npm run build` | Type-check, build to `dist/` and prerender the page into `index.html` |
| `npm run preview` | Serve the production build locally |
| `npm run size` | Check gzipped bundle budgets (after a build) |
| `npm run lint` | oxlint |
| `npm run format` / `format:check` | Prettier |
| `npm test` | Vitest unit tests (content rules, tour state, diagram layout) |
| `npm run e2e` | Playwright smoke tests in Chrome, Firefox, Safari (WebKit), Android and iPhone profiles (first time: `npx playwright install chromium firefox webkit`) |
| `npm run og` | Re-render the link-preview image and touch icon after changing the headline, facts or photo |

Append `?3d=off` to the URL to see the 2D version of the site (what phones and devices without WebGL get).

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: lint → format check → unit tests → build → size budgets → Playwright → publish to GitHub Pages. A separate Lighthouse job reports mobile scores without blocking the deploy. Pull requests run the checks only.

## Updating the CV

The CV button opens `public/cv/Serhii_Lyzun_Senior_Full_Stack_Engineer.pdf` in a new tab. To update it, replace that file with the new PDF, keeping the same filename so the link never changes.
