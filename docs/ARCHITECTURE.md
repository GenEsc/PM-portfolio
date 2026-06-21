# Architecture

This document explains how the project is organized and the conventions used.

## Overview

`pedroescacena.dev` is a Next.js 14 (App Router) site. It is a single marketing
page (`app/page.tsx`) composed of anchored sections, plus dynamic project detail
pages under `app/proyectos/[slug]`. Styling is Tailwind CSS driven by CSS custom
properties for theming. All animations are native CSS + `IntersectionObserver` —
no animation libraries — to keep the bundle small.

## Folder structure & conventions

```
app/              → routes, layout, route handlers, SEO/metadata files
components/       → reusable React components, grouped by role:
  layout/         → structural chrome & overlays (Navbar, Footer, Logo, Loader)
  theme/          → theme context & toggle (ThemeProvider, ThemeToggle)
  sections/       → page sections & sub-components (Hero, About, Stack, Projects,
                    ProjectCard, ServicesSection, Contact, ContactForm)
  animation/      → animation primitives (AnimateOnScroll, Counter, ScrollPath,
                    SmoothScroll)
hooks/            → reusable client hooks (use* naming)
lib/              → framework-agnostic code:
  data/           → content & constants (site, projects, stack — JSX only in stack.tsx)
  utils/          → helpers (smoothScroll)
__tests__/        → Jest + RTL tests mirroring the components/ & lib/ structure
docs/             → project documentation
public/           → static assets
```

Folders with several files are split into subfolders by functionality; small,
cohesive folders (`hooks/`) stay flat.

### Naming conventions

- **Components:** `PascalCase` files and default exports (`Navbar.tsx` → `Navbar`).
- **Hooks:** `useSomething.ts`, camelCase, prefixed with `use`.
- **Data/constants:** `lib/data/*.ts` in `UPPER_SNAKE_CASE` for exported constants
  (`SITE`, `NAV_LINKS`, `STACK`, `PROJECTS`).
- **Section ids** match the navbar anchors (`inicio`, `sobre-mi`, `stack`,
  `proyectos`, `servicios`, `contacto`) and live in `lib/data/site.ts` (`NAV_LINKS`).
- **Test files:** `<Name>.test.tsx`, colocated under `__tests__/` mirroring the
  source tree.

### Server vs. client components

Components are **server components by default**. They become client components
(`"use client"`) only when they need browser APIs, state or effects:

- Client: `Navbar`, `Hero`, `ThemeProvider`, `ThemeToggle`, `AnimateOnScroll`,
  `Counter`, `ScrollPath`, `ContactForm`.
- Server: `About`, `Stack`, `Projects`, `ProjectCard`, `ServicesSection`,
  `Contact`, `Footer`, `Logo` and all `app/` route files.

Server sections (e.g. `About`) freely compose client primitives
(`AnimateOnScroll`, `Counter`) as children.

## Theming system

Theme colors are defined as CSS variables in `app/globals.css` under `:root`
(light) and `.dark` (dark). Tailwind maps semantic tokens to those variables in
`tailwind.config.ts` (`surface`, `content`, `line`, plus the fixed `accent`
palette). `darkMode: "class"` means the `.dark` class on `<html>` flips the
whole palette.

Theme flow:

1. An inline script (`themeInitScript` in `components/theme/ThemeProvider.tsx`) runs
   **before paint** in `app/layout.tsx`, reading `localStorage.theme` or falling
   back to `prefers-color-scheme`, and sets the `.dark` class. This prevents a
   flash of the wrong theme (FOUC).
2. `ThemeProvider` reads the resolved class into React state and exposes
   `toggleTheme` / `setTheme` via context.
3. `ThemeToggle` calls `toggleTheme`, which updates the class and persists the
   choice to `localStorage`.

## Scroll & animation system

The scroll/animation behaviour is split into small, reusable pieces:

- **`hooks/useScrollDirection.ts`** — tracks `scrollY`, scroll `direction` and
  `atTop`, throttled with `requestAnimationFrame`. Powers the navbar hide/show.
- **`hooks/useActiveSection.ts`** — one `IntersectionObserver` over all sections;
  the entry with the largest visible ratio becomes the active navbar link.
- **`components/animation/AnimateOnScroll.tsx`** — wraps content and applies the "pop"
  enter animation when it scrolls into view, then **disconnects** the observer so
  it never re-animates (the `hasAnimated` behaviour).
- **`components/animation/Counter.tsx`** — counts from 0 to a target with `easeOutCubic`
  once visible, a single time.
- **`components/animation/ScrollPath.tsx`** — a fixed background SVG whose path is drawn
  via `stroke-dashoffset`, lerped toward overall scroll progress each frame.
- **`lib/utils/smoothScroll.ts` + `components/animation/SmoothScroll.tsx`** — JS momentum scroll
  (`easeInOutCubic`) for anchor navigation, replacing CSS `scroll-behavior`.

See [ANIMATIONS.md](./ANIMATIONS.md) for the exact easings, durations and logic.

## Data flow

All editable content is centralized in `lib/`:

- `lib/data/site.ts` — personal data, navigation links, section ids, stats.
- `lib/data/projects.ts` — the projects array + `getProjectBySlug`.
- `lib/data/stack.tsx` — the technology stack grouped in three columns.

Components import from `lib/` rather than hard-coding content, so updating text
or adding a project never requires touching the components. See
[CONTRIBUTING.md](./CONTRIBUTING.md).

## SEO

- Global metadata + Open Graph in `app/layout.tsx`; per-project metadata via
  `generateMetadata` in `app/proyectos/[slug]/page.tsx`.
- `app/sitemap.ts` and `app/robots.ts` are generated from `lib/`.
- `app/opengraph-image.tsx` and `app/apple-icon.tsx` generate images at build
  time with `next/og`.
- Semantic HTML throughout (`header`, `nav`, `main`, `section`, `article`,
  `footer`), and `alt` text on all images.
