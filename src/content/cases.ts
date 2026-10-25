// Commercial projects only. Order = constellation tour order (featured first).
import excelMarketplace from '@/assets/cases/excel-marketplace.png?picture'
import excelSheet from '@/assets/cases/excel-sheet.png?picture'
import mapSdkDocs from '@/assets/cases/map-sdk-docs.png?picture'
import mapSdkNpm from '@/assets/cases/map-sdk-npm.png?picture'
import stripeTrialPlans from '@/assets/cases/stripe-trial-plans.png?picture'
import type { CaseStudy } from './types'

const INTELLIAS_USA = 'Intellias · USA logistics client'
const LEAD_ROLE = 'Lead / Senior Full-Stack Engineer'
const MILEMAKER_PERIOD = '2022 – now'
const LED_WITH_SENIOR_FE = 'Me (team lead, ~50% hands-on) + 1 Senior Frontend Engineer'
const SOLO = 'Me, as the only engineer'

export const cases: CaseStudy[] = [
  {
    slug: 'excel-add-in',
    featured: true,
    title: 'MileMaker Excel Add-in',
    tagline: 'Truck routing right inside Excel',
    company: INTELLIAS_USA,
    role: LEAD_ROLE,
    contribution:
      'Team lead with ~50% of my time on hands-on development. I designed the architecture, built part of the add-in, and owned code reviews and the Marketplace release.',
    team: LED_WITH_SENIOR_FE,
    ownership: 'Led · team of 2',
    period: MILEMAKER_PERIOD,
    stack: ['React', 'TypeScript', 'Office Add-ins API', 'Node.js', 'HERE Maps'],
    star: {
      situation:
        'The platform calculated truck-legal routes only in the web app. Large B2B customers (carriers, shippers, brokers) keep their origin/destination lists in Excel. Moving that data into the web app and back meant manual copy-paste, which held back bigger deals.',
      task: "Bring MileMaker's truck-legal distance and drive-time calculation into Excel, reusing the platform's existing services, and publish it on the Microsoft Marketplace.",
      action: [
        'Designed the add-in as one more client of the shared Node.js API (same as the web app and the Map SDK), so routing rules live in one place.',
        'Built the UI in React + TypeScript on the Office Add-ins API, together with the Senior Frontend Engineer. Users select cell ranges for origins and destinations and set the routing options (guide version, routing type, truck trailer length). The add-in writes distance and duration back into the sheet.',
        'Supported the location formats customers already keep in their sheets: address, city, ZIP code, lat/lon, SPLC.',
        'Single sign-in with the existing MileMaker web-app account.',
        'Led the team through technical design, code reviews and release to the Marketplace.',
      ],
      result: [
        'Helped the client land 2 additional major B2B customers (confirmed by the client).',
        'Customers calculate mileage and drive times for whole lists of routes inside Excel, with no copy-paste.',
        'The add-in reuses the shared services, so it gives the same results as the web app and the SDK.',
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
          text: 'In a team of 2 (1 Senior Frontend Engineer + me as team lead), we shipped the MVP in 2 sprints and the full feature in 4 sprints. Stakeholders set the high-level requirements and validated our demos and finished work. I owned technical design, code reviews and the Marketplace release.',
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
        contribution:
          'Designed the add-in and built part of it, including batching routes (20 at a time) to keep Excel syncs fast.',
        why: 'Customers process whole route lists without copy-paste.',
      },
      {
        kind: 'screenshot',
        picture: excelMarketplace,
        alt: 'Microsoft Marketplace listing of MileMaker for Excel: "Calculate truck-legal distances and drive times between locations across North America"',
        caption: 'Microsoft Marketplace listing',
        contribution: 'Led the team and the Marketplace release.',
        why: 'Any Excel user can install the add-in.',
      },
    ],
    headlineMetric: '+2 major B2B customers',
    metrics: [
      { value: '+2', label: 'major B2B customers, confirmed by the client' },
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
    contribution:
      'The only engineer on it: I designed and built the Stripe billing service on Node.js and the plan, billing and trial flow in React.',
    team: SOLO,
    ownership: 'Built solo',
    period: MILEMAKER_PERIOD,
    stack: ['React', 'Node.js', 'TypeScript', 'Stripe'],
    star: {
      situation: 'The platform needed to sell to individual (B2C) users, not only to B2B accounts.',
      task: 'Build self-service billing: plans, subscriptions and a free trial, with no manual steps.',
      action: [
        'Implemented subscription billing and a 14-day trial flow with React, Node.js and Stripe.',
        'Architected a custom Stripe-based billing service on Node.js.',
        'Built plan selection, monthly / annual billing and the free trial in the React web app.',
        'Automated the B2C payment flow end-to-end.',
      ],
      result: [
        'B2C users subscribe and start a trial on their own, with no manual steps.',
        'After the launch: +5% new B2C customers per year (confirmed by the client).',
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
        contribution: 'Built this page and the billing service behind it.',
        why: 'B2C users can subscribe on their own, with no sales call.',
      },
    ],
    headlineMetric: '+5% B2C customers / year',
    metrics: [
      { value: '+5%', label: 'new B2C customers per year, confirmed by the client' },
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
    contribution:
      'The only engineer on it: I designed and built the LLM agent, the MCP client for the chatbot and the MCP server tools.',
    team: SOLO,
    ownership: 'Built solo',
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
      result: ['New users can start using the services right away.'],
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
    headlineMetric: 'Users start right away',
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
    contribution:
      'Team lead with ~50% of my time on hands-on development: led the design and development of the SDK and its docs site, and wrote part of the code.',
    team: LED_WITH_SENIOR_FE,
    ownership: 'Led · team of 2',
    period: MILEMAKER_PERIOD,
    stack: ['TypeScript', 'HERE Maps', 'Leaflet', 'npm', 'Vite'],
    star: {
      situation:
        "Enterprise customers wanted truck-legal routing and maps inside their own applications. The SDK became one of the platform's 8+ sub-systems.",
      task: 'Ship a public JavaScript SDK and the documentation developers need to adopt it.',
      action: [
        'Led the design and development of the Map SDK as a public npm package on the shared Node.js API.',
        'Built the SDK documentation website with guides and an API reference.',
      ],
      result: [
        "Developers at Enterprise-plan customers can add MileMaker's truck-legal routing and maps to their own applications from a public npm package, following the docs.",
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
        contribution: 'Led the docs site together with the SDK.',
        why: 'Developers can integrate on their own, from the guides.',
      },
      {
        kind: 'screenshot',
        picture: mapSdkNpm,
        alt: 'npm page of @milemaker/milemaker-js: Map Display SDK readme with yarn, npm and CDN installation instructions',
        caption: 'Public package on npm',
        contribution: "Led the SDK's design and development and wrote part of the code.",
        why: 'Routing ships to customers as a standard JavaScript dependency.',
      },
    ],
    headlineMetric: 'Public SDK + docs',
    metrics: [
      { value: 'npm', label: 'public TypeScript package' },
      { value: 'Docs', label: 'guides and API reference for self-service integration' },
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
    role: 'Senior JavaScript Engineer (React), leading a team of 5 (Ukraine + Germany)',
    contribution:
      'Led the team of 5 and contributed to every feature, including the shared component library, the map-based features and the tests.',
    team: 'A team of 5 across Ukraine and Germany, led by me',
    ownership: 'Led · team of 5',
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
    ndaNote:
      'Client name, product and screenshots are under NDA; the numbers are cleared for sharing.',
    star: {
      situation:
        'A new map-based logistics product had to be built from scratch, and the client needed to validate the idea fast.',
      task: 'Deliver the MVP and a UI foundation that keeps new screens fast to build.',
      action: [
        'Led the team of 5 and contributed to every feature of the product.',
        'Worked on the reusable Storybook component library and the map-based features with the team.',
        'Covered the code with unit and snapshot tests (Jest + React Testing Library).',
      ],
      result: [
        'MVP delivered in < 6 months.',
        'Component library covers ~70% of the UI, so new screens are built from shared components.',
        '80%+ unit/snapshot test coverage, so regression checks run automatically with every change.',
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
    // Separate, fogged cluster: different client
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
