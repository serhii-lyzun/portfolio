// Source: home-work-lesson-29.md (STAR cases) + how-work-lesson-30.md (Excel Add-in deep-dive).
// Commercial projects only (plan D7). Order = constellation tour order (featured first).
import excelMarketplace from '@/assets/cases/excel-marketplace.png?picture'
import excelSheet from '@/assets/cases/excel-sheet.png?picture'
import mapSdkDocs from '@/assets/cases/map-sdk-docs.png?picture'
import mapSdkNpm from '@/assets/cases/map-sdk-npm.png?picture'
import stripeTrialPlans from '@/assets/cases/stripe-trial-plans.png?picture'
import type { CaseStudy } from './types'

const INTELLIAS_USA = 'Intellias · USA logistics client'
const LEAD_ROLE = 'Lead / Senior Full-Stack Engineer'
const MILEMAKER_PERIOD = '2022 – now'

export const cases: CaseStudy[] = [
  {
    slug: 'excel-add-in',
    featured: true,
    title: 'MileMaker Excel Add-in',
    tagline: 'Truck routing right inside Excel',
    company: INTELLIAS_USA,
    role: LEAD_ROLE,
    period: MILEMAKER_PERIOD,
    stack: ['React', 'TypeScript', 'Office Add-ins API', 'Node.js', 'HERE Maps'],
    star: {
      situation:
        'The platform calculated truck-legal routes only in the web app. Large B2B customers (carriers, shippers, brokers) keep their origin/destination lists in Excel. Moving that data into the web app and back meant manual copy-paste, which held back bigger deals.',
      task: "Bring MileMaker's truck-legal distance and drive-time calculation into Excel, reusing the platform's existing services, and publish it on the Microsoft Marketplace.",
      action: [
        'Designed the add-in as one more client of the shared Node.js API (same as the web app and the Map SDK), so routing rules live in one place.',
        'Built the UI in React + TypeScript on the Office Add-ins API. Users select cell ranges for origins and destinations and set the routing options (guide version, routing type, truck trailer length). The add-in writes distance and duration back into the sheet.',
        'Supported the location formats customers already keep in their sheets: address, city, ZIP code, lat/lon, SPLC.',
        'Single sign-in with the existing MileMaker web-app account.',
        'Led the team through technical design, code reviews and release to the Marketplace.',
      ],
      result: [
        'Helped the client land 2 additional major B2B customers.',
        'Customers calculate mileage and drive times for whole lists of routes inside Excel, with no copy-paste.',
        'One integrated ecosystem: Web, Excel Add-in, npm SDK and AI/MCP tools on shared services.',
      ],
    },
    deepDive: {
      approach: [
        {
          title: 'Architecture',
          text: 'I designed the add-in as one more client of the shared Node.js API, next to the web app and the Map SDK. Routing rules live in one place, so every product returns the same results.',
        },
        {
          title: 'Customer-first product',
          text: 'I supported the location formats customers already keep in their sheets: address, city, ZIP code, lat/lon and SPLC. Users select cell ranges, set the routing options (guide version, routing type, truck trailer length) and get distance and duration written back into the sheet.',
        },
        {
          title: 'Ease of use',
          text: 'Single sign-in with the existing MileMaker web-app account.',
        },
        {
          title: 'Performance',
          text: 'Syncing with Excel is slow, so I processed routes in batches of 20 with a minimum of sheet syncs. Users get results for large route lists in reasonable time.',
        },
        {
          title: 'State Breakdown reports',
          text: 'After the MVP, extended the add-in with per-state mileage breakdown reports.',
        },
        {
          title: 'Delivery & stakeholders',
          text: 'In a team of 2 (1 developer + 1 team lead), we shipped the MVP in 2 sprints and the full feature in 4 sprints. Stakeholders set the high-level requirements and validated our demos and finished work. I owned technical design, code reviews and the Marketplace release.',
        },
      ],
      hardestPart:
        'Async performance: syncing with the Excel sheet through the Office Add-ins API takes time, so calculating routes one by one was too slow. Processing routes in batches of 20 with minimal syncing gave users good-enough performance on large route lists.',
      whatItShows:
        'I take a product from a business problem to a measurable result. I design architecture that scales to new channels, lead the team that builds it, and shape the solution around real customer needs.',
    },
    links: [
      {
        kind: 'marketplace',
        label: 'Microsoft Marketplace',
        href: 'https://marketplace.microsoft.com/en-us/product/WA200006859',
      },
    ],
    media: [
      {
        kind: 'screenshot',
        picture: excelSheet,
        alt: 'Excel sheet with origins and destinations in five formats (address, city, ZIP code, lat/lon, SPLC); the MileMaker add-in panel on the right shows the routing configuration, and distance and duration are filled in for every row',
        caption: 'Distance and duration calculated in a sheet',
      },
      {
        kind: 'screenshot',
        picture: excelMarketplace,
        alt: 'Microsoft Marketplace listing of MileMaker for Excel: "Calculate truck-legal distances and drive times between locations across North America"',
        caption: 'Microsoft Marketplace listing',
      },
    ],
    headlineMetric: '+2 major B2B customers',
    metrics: [
      { value: '+2', label: 'major B2B customers' },
      { value: '2 / 4', label: 'sprints to MVP / full feature' },
      { value: '5', label: 'location formats supported' },
    ],
    node: {
      color: '#ff5a4e',
      size: 1.35,
      orbit: { radius: 4.7, speed: 0.22, phase: 0.3, tilt: 0.55 },
    },
  },
  {
    slug: 'stripe-billing',
    title: 'Stripe Billing & Free Trial',
    tagline: 'Self-service B2C plans, subscriptions and trials',
    company: INTELLIAS_USA,
    role: LEAD_ROLE,
    period: MILEMAKER_PERIOD,
    stack: ['React', 'Node.js', 'TypeScript', 'Stripe'],
    star: {
      situation: 'The platform needed to sell to individual (B2C) users, not only to B2B accounts.',
      task: 'Build self-service billing: plans, subscriptions and a free trial, with no manual steps.',
      action: [
        'Architected a custom Stripe-based billing service on Node.js.',
        'Built plan selection, monthly / annual billing and a 14-day free trial in the React web app.',
        'Automated the B2C payment flow end-to-end.',
      ],
      result: [
        '+5% new B2C customers per year.',
        'A billing system that grows revenue 10% yearly.',
      ],
    },
    links: [
      {
        kind: 'live',
        label: 'Trial plans (live)',
        href: 'https://app.milemaker.com/billing/trial-plans',
      },
    ],
    media: [
      {
        kind: 'screenshot',
        picture: stripeTrialPlans,
        alt: 'MileMaker "Select your plan" page: Standard Plan with annual/monthly toggle, $864 per year billed annually with 10% saving, a Start Trial button and a 14-day trial; Enterprise Plan with a Contact Us button',
        caption: 'Plan selection with the 14-day free trial',
      },
    ],
    headlineMetric: '+5% B2C customers / year',
    metrics: [
      { value: '+5%', label: 'new B2C customers per year' },
      { value: '+10%', label: 'revenue growth per year' },
      { value: '14 days', label: 'free trial, fully self-service' },
    ],
    node: {
      color: '#a78bfa',
      size: 1,
      orbit: { radius: 4.7, speed: 0.19, phase: 2.45, tilt: 0.55 },
    },
  },
  {
    slug: 'ai-mcp',
    title: 'AI Agent & MCP tools',
    tagline: 'An AI chatbot that can use the platform for the user',
    company: INTELLIAS_USA,
    role: LEAD_ROLE,
    period: MILEMAKER_PERIOD,
    stack: ['LLM APIs (Anthropic, OpenAI)', 'MCP client/server', 'RAG', 'Node.js', 'TypeScript'],
    star: {
      situation:
        "New users needed help to get started with the platform, and that support took people's time.",
      task: "Let users get answers and use the platform's services through an AI chatbot.",
      action: [
        'Built a custom LLM-based AI agent.',
        "Built an Anthropic MCP client for the chatbot and MCP tools on the MCP server, giving the agent access to the platform's services.",
      ],
      result: [
        "Cut the client's need for extra hires.",
        'New users can start using the services right away.',
      ],
    },
    links: [],
    media: [
      {
        kind: 'diagram',
        caption: 'How the chatbot reaches the platform',
        nodes: [
          { id: 'user', label: 'User' },
          { id: 'chatbot', label: 'AI Chatbot', detail: 'MCP client' },
          { id: 'agent', label: 'LLM agent' },
          { id: 'mcp', label: 'MCP server tools' },
          { id: 'api', label: 'Platform Node.js services' },
        ],
        edges: [
          ['user', 'chatbot'],
          ['chatbot', 'agent'],
          ['agent', 'mcp'],
          ['mcp', 'api'],
        ],
      },
    ],
    headlineMetric: 'Fewer extra hires',
    metrics: [
      { value: 'Right away', label: 'new users start using the services' },
      { value: 'MCP', label: 'client + server tools' },
    ],
    node: {
      color: '#34d399',
      size: 1,
      orbit: { radius: 4.7, speed: 0.24, phase: 3.8, tilt: 0.55 },
    },
  },
  {
    slug: 'map-sdk',
    title: 'Map SDK (npm) & developer docs',
    tagline: 'Truck-legal routing and maps inside customer apps',
    company: INTELLIAS_USA,
    role: LEAD_ROLE,
    period: MILEMAKER_PERIOD,
    stack: ['TypeScript', 'HERE Maps', 'Leaflet', 'npm', 'Vite'],
    star: {
      situation:
        'Enterprise customers wanted truck-legal routing and maps inside their own applications.',
      task: 'Ship a public JavaScript SDK and the documentation developers need to adopt it.',
      action: [
        'Built the Map SDK as a public npm package on the shared Node.js API.',
        'Built the SDK documentation website with guides and an API reference.',
      ],
      result: [
        'Enterprise-plan customers can integrate MileMaker routing via API and SDK.',
        'One of the 8+ sub-systems of the platform.',
      ],
    },
    links: [
      {
        kind: 'npm',
        label: 'npm @milemaker/milemaker-js',
        href: 'https://www.npmjs.com/package/@milemaker/milemaker-js',
      },
      {
        kind: 'docs',
        label: 'SDK docs',
        href: 'https://js-developer.milemaker.com/guides/overview',
      },
    ],
    media: [
      {
        kind: 'screenshot',
        picture: mapSdkDocs,
        alt: 'MileMaker JavaScript Maps SDK documentation: guides navigation, an interactive map of the United States with Add Route / Remove Route buttons and a code example using createMap',
        caption: 'SDK documentation site with a live map example',
      },
      {
        kind: 'screenshot',
        picture: mapSdkNpm,
        alt: 'npm page of @milemaker/milemaker-js: Map Display SDK readme with yarn, npm and CDN installation instructions',
        caption: 'Public package on npm',
      },
    ],
    headlineMetric: 'Public SDK + docs',
    metrics: [
      { value: 'npm', label: 'public TypeScript package' },
      { value: '8+', label: 'platform sub-systems, SDK is one' },
    ],
    node: {
      color: '#fbbf24',
      size: 1,
      orbit: { radius: 4.6, speed: 0.2, phase: 5.45, tilt: 0.55 },
    },
  },
  {
    slug: 'nda-logistics',
    title: 'Logistics web platform',
    tagline: 'Map-based product from scratch to MVP',
    company: 'European client (NDA)',
    role: 'Senior Frontend Engineer in a cross-country team (Ukraine + Germany)',
    period: '2020 – 2022',
    stack: [
      'React',
      'Redux',
      'TypeScript',
      'Material-UI',
      'Storybook',
      'Jest',
      'React Testing Library',
      'HERE Maps',
    ],
    nda: true,
    ndaNote: 'Client name, product and screenshots are under NDA.',
    star: {
      situation:
        'A new map-based logistics product had to be built from scratch, and the client needed to validate the idea fast.',
      task: 'Deliver the MVP and a UI foundation that keeps new screens fast to build.',
      action: [
        'Built a reusable Storybook component library and the map-based features.',
        'Set up unit and snapshot testing with Jest + React Testing Library.',
      ],
      result: [
        'MVP delivered in < 6 months.',
        'Component library covers ~70% of the UI, so new screens ship faster.',
        '80%+ test coverage, giving fewer production regressions.',
      ],
    },
    links: [],
    media: [
      {
        kind: 'diagram',
        caption: 'UI architecture (NDA-safe, no real UI)',
        nodes: [
          { id: 'ui', label: 'React screens' },
          { id: 'lib', label: 'Storybook library', detail: '~70% of UI' },
          { id: 'map', label: 'Map features' },
          { id: 'tests', label: 'Jest + RTL', detail: '80%+ coverage' },
        ],
        edges: [
          ['ui', 'lib'],
          ['ui', 'map'],
          ['lib', 'tests'],
        ],
      },
    ],
    headlineMetric: 'MVP in < 6 months',
    metrics: [
      { value: '< 6 mo', label: 'to MVP' },
      { value: '~70%', label: 'of UI from the component library' },
      { value: '80%+', label: 'test coverage' },
    ],
    // Separate, fogged cluster: different client (plan § 2)
    node: {
      color: '#94a3b8',
      size: 0.9,
      orbit: { radius: 0.45, speed: 0.3, phase: 0, tilt: 0.6 },
      anchor: [4.6, -3.3, -1.2],
    },
  },
]

export const featuredCase = cases.find((c) => c.featured) ?? cases[0]

export const getCase = (slug: string) => cases.find((c) => c.slug === slug)
