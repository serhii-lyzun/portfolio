# portfolio

Portfolio of **Serhii Lyzun — Senior Full-Stack Engineer (React / Node.js)**.

**Live:** https://serhii-lyzun.github.io/portfolio/

- Case studies (STAR): [home-work-lesson-29.md](home-work-lesson-29.md)
- Interview "fire" case: [how-work-lesson-30.md](how-work-lesson-30.md)
- Site plan & architecture: [PORTFOLIO_SITE_PLAN.md](PORTFOLIO_SITE_PLAN.md)

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Three.js (React Three Fiber + drei) · GSAP · Motion

## Develop

Requires Node 22.12+ (`.nvmrc` pins 24).

```sh
nvm use
npm install
npm run dev        # http://localhost:5173/portfolio/
```

| Script | What it does |
|---|---|
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | oxlint |
| `npm run format` / `format:check` | Prettier |
| `npm test` | Vitest |

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: lint → format check → tests → build → publish to GitHub Pages. Pull requests run the checks only.

## Updating the CV

The CV button opens `public/cv/Serhii_Lyzun_Senior_Full_Stack_Engineer.pdf` in a new tab. To update it, replace that file with the new export of the Senior Full-Stack master CV, keeping the same filename so the link never changes.
