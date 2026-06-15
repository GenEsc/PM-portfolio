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

### `ProjectCard` — Server

Card with hover overlay (dark-green, fades in, reveals "Ver demo" / "Ver código")
and a `scale(1.02)` lift. The whole card links to the detail page.

| Prop      | Type      | Description                          |
| --------- | --------- | ------------------------------------ |
| `project` | `Project` | A project from `lib/projects.ts`.    |

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
anchor clicks into a JS momentum scroll (`lib/smoothScroll.ts`, `easeInOutCubic`,
distance-based duration, 70px navbar offset). No props. Rendered once in
`app/layout.tsx`.

---

## Hooks

### `useScrollDirection()` → `{ scrollY, direction, atTop }`

Tracks scroll position/direction (rAF-throttled). Used by `Navbar`.

### `useActiveSection(sectionIds)` → `string`

Returns the id of the section currently in view. Used by `Navbar`.
