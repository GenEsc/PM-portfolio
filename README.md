<div align="center">
  <img src="./public/logo.svg" width="72" height="72" alt="Logo" />
  <h1>pedroescacena.dev</h1>
  <p>Personal freelance portfolio — web development, e-commerce & legacy web modernization.</p>
</div>

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-29-C21325?logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/React_Testing_Library-16-E33332?logo=testinglibrary&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-1D9E75)

---

## Description

A single-page marketing portfolio built to attract **e-commerce** and **legacy
web modernization** clients. It is a sales tool, not a CV: the copy focuses on
what the client gains. Built with Next.js (App Router), Tailwind CSS and
TypeScript, with all animations implemented in native CSS + `IntersectionObserver`
to keep the bundle light.

Highlights:

- Single page with anchored sections: Hero, About, Stack, Projects, Services, Contact.
- Dynamic project detail pages at `/proyectos/[slug]`.
- Light/dark theme with `localStorage` persistence and `prefers-color-scheme` default.
- Scroll-driven background SVG path, "pop" enter animations, cursor parallax in
  the hero, animated counters and a smart hide/show navbar.
- SEO: per-page metadata, Open Graph, auto-generated sitemap & robots, semantic HTML.
- Contact form wired to [Resend](https://resend.com).

## Tech stack

| Area        | Technology                                   |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 14 (App Router)                      |
| Language    | TypeScript                                   |
| Styling     | Tailwind CSS + CSS variables                 |
| Animations  | Native CSS + `IntersectionObserver`          |
| Icons       | `react-icons`                                |
| Fonts       | Google Fonts (Fraunces + Inter)              |
| Email       | Resend                                       |
| Testing     | Jest + React Testing Library                 |
| Deployment  | Vercel                                       |

## Prerequisites

- **Node.js** `>= 18.17.0`
- **npm** (or yarn/pnpm)

## Local setup

```bash
# 1. Clone the repository
git clone https://github.com/GenEsc/pedroescacena.dev.git
cd pedroescacena.dev

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in your values (see below)

# 4. Run the development server
npm run dev
# Open http://localhost:3000

# 5. Run tests
npm test

# 6. Build for production
npm run build
npm start
```

### Logo asset

The UI renders the brand mark as an inline, color-adaptive React component
(`components/layout/Logo.tsx`), and a static `public/logo.svg` is included. If you have
an official logo file, replace `public/logo.svg` with it before deploying.

### Environment variables

| Variable               | Required | Description                                       |
| ---------------------- | -------- | ------------------------------------------------- |
| `RESEND_API_KEY`       | For form | Resend API key used by `/api/contact`.            |
| `CONTACT_TO_EMAIL`     | Optional | Recipient of contact submissions.                 |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Public site URL (Open Graph & sitemap).           |

The site builds and runs without `RESEND_API_KEY`; the contact endpoint simply
returns a graceful error so the UI can show a fallback message.

## Available scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the development server.        |
| `npm run build`     | Production build.                    |
| `npm start`         | Run the production build.            |
| `npm test`          | Run the test suite once.             |
| `npm run test:watch`| Run tests in watch mode.             |
| `npm run test:coverage` | Run tests with a coverage report. |
| `npm run lint`      | Run ESLint (next/core-web-vitals).   |

## Project structure

```
pedroescacena.dev/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout: fonts, theme, navbar, footer, SEO
│   ├── page.tsx              # Home (single page with anchored sections)
│   ├── globals.css           # Theme tokens (CSS vars) + base styles
│   ├── icon.svg              # Favicon
│   ├── apple-icon.tsx        # Generated Apple touch icon (PNG)
│   ├── opengraph-image.tsx   # Generated Open Graph image (PNG)
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── robots.ts             # robots.txt
│   ├── not-found.tsx         # 404 page
│   ├── api/contact/route.ts  # Contact form endpoint (Resend)
│   └── proyectos/[slug]/     # Dynamic project detail pages
├── components/               # React components, grouped by role (see docs/COMPONENTS.md)
│   ├── layout/               #   chrome & overlays (Navbar, Footer, Logo, Loader)
│   ├── theme/                #   ThemeProvider, ThemeToggle
│   ├── sections/             #   page sections + sub-components (Hero, About, …)
│   └── animation/            #   primitives (AnimateOnScroll, Counter, ScrollPath, SmoothScroll)
├── hooks/                    # Custom hooks (scroll direction, active section)
├── lib/                      # Framework-agnostic code
│   ├── data/                 #   content & constants (site, projects, stack)
│   └── utils/                #   helpers (smoothScroll)
├── __tests__/                # Jest + RTL tests, mirroring the components/ & lib/ structure
├── docs/                     # Architecture, animations, components & contributing docs
└── public/                   # Static assets (logo, project screenshots)
```

## Deployment (Vercel)

1. Push to GitHub and import the repo into [Vercel](https://vercel.com).
2. Vercel auto-detects Next.js — no extra build config needed.
3. Add the environment variables (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
   `NEXT_PUBLIC_SITE_URL`) in **Project Settings → Environment Variables**.
4. The `main` branch deploys to production automatically; `develop` and PRs get
   preview deployments. See [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for the
   branching strategy.
5. Add the custom domain (`pedroescacena.dev`) in **Project Settings → Domains**.

## Documentation

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — structure & conventions.
- [docs/ANIMATIONS.md](./docs/ANIMATIONS.md) — every animation, with easings & logic.
- [docs/COMPONENTS.md](./docs/COMPONENTS.md) — component reference.
- [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) — add a project, update data, deploy.

## License

[MIT](./LICENSE) © Pedro Escacena Macías
