# Components

Reference for every component: purpose, props and a usage example. Components
live in `components/`. Data comes from `lib/` (see
[ARCHITECTURE.md](./ARCHITECTURE.md)).

> "Client" = `"use client"` component; "Server" = React Server Component.

---

## Layout & theming

### `Logo` — Server

The brand mark as an inline SVG using `currentColor` (emerald on light, white on
dark). Faithfully reproduces the network-node logo (circle + 12 spokes + hub).

| Prop        | Type     | Default  | Description                  |
| ----------- | -------- | -------- | ---------------------------- |
| `className` | `string` | `""`     | Sizing/color via Tailwind.   |
| `title`     | `string` | `"Logo"` | Accessible label.            |

```tsx
<Logo className="h-8 w-8 text-accent" />
```

### `ThemeProvider` — Client

Provides theme context (`theme`, `toggleTheme`, `setTheme`) and keeps the `.dark`
class on `<html>` in sync with `localStorage`. Also exports `themeInitScript`
(inline anti-FOUC script) and the `useTheme()` hook.

```tsx
<ThemeProvider>{children}</ThemeProvider>
```

### `ThemeToggle` — Client

Sun/moon button that flips light/dark and persists the choice. No props. Must be
rendered inside `ThemeProvider`.

### `Navbar` — Client

Sticky navbar: hides on scroll-down, reappears on scroll-up (solid + blurred),
transparent on the hero, highlights the active section, and collapses into a
hamburger menu on mobile. No props. Exposes `data-hidden` / `data-solid` for
tests. Depends on `useScrollDirection` and `useActiveSection`.

### `Footer` — Server

Brand, copyright and social links. No props.

### `Loader` — Client

Full-screen loading overlay with a spinning `Logo`, shown once per session on
first paint. Background uses `var(--bg)` so it matches the active theme. Stays up
until assets load and a 1000ms minimum has passed, then slides up to reveal the
page. Gated by `sessionStorage` (`hasSeenLoader`); also exports `loaderInitScript`
to hide the overlay before paint on repeat visits. Respects
`prefers-reduced-motion`. No props. See [ANIMATIONS.md](./ANIMATIONS.md) §11.

---

## Sections

All section components are **Server** components and take **no props** (they read
content from `lib/`). They render a semantic `<section>` with the id used by the
navbar anchors.

| Component         | Id          | Purpose                                            |
| ----------------- | ----------- | -------------------------------------------------- |
| `Hero` (Client)   | `inicio`    | Name, tagline, availability badge, CTAs, parallax. |
| `About`           | `sobre-mi`  | Client-oriented intro + animated counters.         |
| `Stack`           | `stack`     | Technology icons grid (3 columns).                 |
| `Projects`        | `proyectos` | Grid of `ProjectCard`s.                            |
| `ServicesSection` | `servicios` | Three service cards, each with a CTA.              |
| `Contact`         | `contacto`  | Heading, `ContactForm`, email & social links.      |

```tsx
// app/page.tsx
<main>
  <Hero />
  <About />
  <Stack />
  <Projects />
  <ServicesSection />
  <Contact />
</main>
```

---

## Projects

Renders one of two card kinds based on `project.kind`:

- **`professional`** — informational card: generic icon + company name as styled
  text (never a logo) + description. Not clickable; no tech chips or overlay.
- **`personal`** — clickable card with a screenshot, tech chips, a dark-green
  hover overlay ("Ver demo" / "Ver código") and a `scale(1.02)` lift; links to
  the detail page.

| Prop      | Type      | Description                          |
| --------- | --------- | ------------------------------------ |
| `project` | `Project` | A project from `lib/data/projects.ts` (`ProfessionalProject \| PersonalProject`). |

```tsx
<ProjectCard project={PROJECTS[0]} />
```

---

## Contact

### `ContactForm` — Client

Name / email / message form with client-side validation. On valid submit it
POSTs JSON to `/api/contact`. Shows success/error states. No props.

---

## Animation primitives

### `AnimateOnScroll` — Client

Wraps content with the "pop" enter animation; animates once and never re-animates.

| Prop        | Type          | Default | Description                              |
| ----------- | ------------- | ------- | ---------------------------------------- |
| `children`  | `ReactNode`   | —       | Content to animate.                      |
| `as`        | `ElementType` | `"div"` | Element/tag to render.                   |
| `delay`     | `number`      | `0`     | Stagger delay in ms (convention: 50/sib).|
| `className` | `string`      | `""`    | Extra classes.                           |

```tsx
<AnimateOnScroll delay={index * 50}>
  <Card />
</AnimateOnScroll>
```

### `Counter` — Client

Counts from 0 to `value` once visible, with `easeOutCubic`.

| Prop       | Type     | Default | Description                       |
| ---------- | -------- | ------- | --------------------------------- |
| `value`    | `number` | —       | Target value.                     |
| `suffix`   | `string` | `""`    | Appended after the number.        |
| `delay`    | `number` | `0`     | Delay before counting (ms).       |
| `duration` | `number` | `1200`  | Animation duration (ms).          |
| `className`| `string` | `""`    | Extra classes.                    |

```tsx
<Counter value={4} delay={200} />
```

### `ScrollPath` — Client

Fixed background SVG path drawn via `stroke-dashoffset`, lerped toward the scroll
target each frame. No props. Rendered once in `app/layout.tsx`.

### `SmoothScroll` — Client

Headless (renders `null`). Mounts one delegated listener that turns in-page
anchor clicks into a JS momentum scroll (`lib/utils/smoothScroll.ts`, `easeInOutCubic`,
distance-based duration, 70px navbar offset). No props. Rendered once in
`app/layout.tsx`.

---

## Hooks

### `useScrollDirection()` → `{ scrollY, direction, atTop }`

Tracks scroll position/direction (rAF-throttled). Used by `Navbar`.

### `useActiveSection(sectionIds)` → `string`

Returns the id of the section currently in view. Used by `Navbar`.
