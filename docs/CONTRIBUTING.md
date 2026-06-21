# Contributing

How to add a project, update personal data and deploy a new version.

## Prerequisites

- Node.js `>= 18.17.0` and npm.
- Run `npm install` once after cloning.
- Before pushing: `npm run lint && npm test && npm run build` must all pass.

---

## Add a new project to the portfolio

Projects are data-driven from [`lib/data/projects.ts`](../lib/data/projects.ts). Adding one
requires **no component changes**.

1. **(Optional) Add a screenshot** to `public/projects/`, e.g.
   `public/projects/my-shop.png` (16:10 looks best on the cards).

2. **Append an entry** to the `PROJECTS` array in `lib/data/projects.ts`:

   ```ts
   {
     slug: "my-shop",                       // unique; becomes /proyectos/my-shop
     title: "My Shop",
     summary: "One-line summary for the card.",
     problem: "The business problem it solves.",
     description: "Longer description for the detail page.",
     tech: ["Next.js", "TypeScript", "Stripe"],
     image: "/projects/my-shop.png",        // or an existing placeholder
     demoUrl: "https://my-shop.com",         // use "#" if none yet
     codeUrl: "https://github.com/...",      // use "#" if none yet
     highlights: [
       "What you built / delivered",
       "Another highlight",
     ],
   },
   ```

3. That's it. The card appears in the Projects section, the detail page at
   `/proyectos/my-shop` is generated (via `generateStaticParams`), and the
   sitemap updates automatically.

> The card grid is `md:grid-cols-2`. With 3+ projects it simply wraps; no layout
> change needed.

---

## Update personal data

All personal content is centralized — never hard-code it in components.

| What to change                       | Where                              |
| ------------------------------------ | ---------------------------------- |
| Name, role, tagline, email, socials  | `lib/data/site.ts` → `SITE`             |
| Navbar links / section ids           | `lib/data/site.ts` → `NAV_LINKS`        |
| Counter values (years, techs, devs)  | `lib/data/site.ts` → `STATS`            |
| Technology stack (3 columns)         | `lib/data/stack.tsx` → `STACK`          |
| Services cards                       | `components/sections/ServicesSection.tsx`   |
| About text                           | `components/sections/About.tsx`             |
| Theme colors                         | `app/globals.css` (CSS variables)  |
| Logo                                 | `public/logo.svg` + `components/layout/Logo.tsx` |

After editing, run `npm run dev` and check the page, then `npm test`.

---

## Branching strategy

```
feature/*  ·  fix/*  ·  hotfix/*
        │
     develop      → integration & testing
        │
      main         → production (auto-deploy on Vercel)
```

- **`main`** is always production-ready — never commit directly to it.
- **`develop`** is the integration branch; features and fixes merge here first.
- Every feature/fix branches from `develop` and opens a PR back to `develop`.
- When `develop` is stable, merge it into `main` and Vercel deploys.

### Branch naming

| Type            | Pattern                      | Example                        |
| --------------- | ---------------------------- | ------------------------------ |
| Feature         | `feature/short-description`  | `feature/hero-section`         |
| Bug fix         | `fix/short-description`      | `fix/navbar-scroll-behavior`   |
| Hotfix to prod  | `hotfix/short-description`   | `hotfix/contact-form-broken`   |

### Commit messages (Conventional Commits, in English)

```
feat: add hero section with availability badge
fix: navbar not hiding on scroll down in mobile
chore: set up jest and react testing library
docs: add ANIMATIONS.md to /docs folder
style: adjust spacing in project cards
refactor: extract scroll observer into custom hook
```

---

## Deploy a new version

1. Open a PR into `develop`; wait for the preview deploy and review.
2. Merge into `develop` and verify the integration preview.
3. When ready for production, merge `develop` → `main`.
4. Vercel builds and deploys `main` automatically.
5. Verify production and the custom domain (`pedroescacena.dev`).

### Environment variables (Vercel → Project Settings)

- `RESEND_API_KEY` — required for the contact form.
- `CONTACT_TO_EMAIL` — recipient address (optional).
- `NEXT_PUBLIC_SITE_URL` — production URL for Open Graph & sitemap.

---

## Testing

- Framework: **Jest + React Testing Library** (`jest.config.ts`, `jest.setup.ts`).
- Tests live in `__tests__/`, mirroring `app/` and `components/`.
- Write tests in English. Run with `npm test` (or `npm run test:watch`).
- When adding a component with behaviour, add a matching test.
