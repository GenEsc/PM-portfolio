# Change: animated tech-stack & UI icons

Replaces the static icons with two libraries: **`developer-icons`** (coloured
SVG tech logos) for the stack, and **`lucide-animated`** (Lucide icons animated
with `motion`) for UI + career-timeline icons. `motion` drives the stack's
hover animations.

```bash
npm install developer-icons lucide-animated motion
```

## As implemented (the real package APIs differ from the original brief)

The original request assumed export names that don't exist. Verified against the
installed packages, the actual APIs are:

- **`developer-icons` v7** — exports are the bare brand name: `React`, `Angular`,
  `TypeScript`, `HTML5`, `CSS3`, `Java`, `Spring`, `PostgreSQL`, `MongoDB`,
  `AWS`, `Azure`, `Docker`, `Git` (not `ReactjsIcon` etc.). Plain SVG functions
  with a `size` prop and **built-in brand colours** (not recoloured). No
  "use client". They are re-exported (aliased, so `React` doesn't shadow React)
  as client references from [components/icons/brand-logos.tsx](components/icons/brand-logos.tsx),
  because the stack section passes the chosen logo as a prop to a client component.
- **`lucide-animated` v1** — exports are `{Name}Icon` (`MenuIcon`, `SendIcon`,
  `UsersIcon`…), props `{ size?, animateOnHover?, ...divProps }`, colour via
  `currentColor` (no `color` prop), and a ref handle `{ startAnimation, stopAnimation }`
  for programmatic triggering. Several icons in the brief don't exist; substitutes:
  Code→`TerminalIcon`/`FolderCodeIcon`, ShoppingCart→`CartIcon`, Mail→`AtSignIcon`,
  Landmark→`CreditCardIcon` (payments), Building→`UsersIcon`. The ones used by
  Server Components are re-exported from [components/icons/animated.tsx](components/icons/animated.tsx)
  (a "use client" module — lucide-animated ships no "use client" of its own).

## Part 1 — Tech stack (`developer-icons` + Motion hover)

[lib/data/stack.tsx](lib/data/stack.tsx) holds 13 techs grouped Frontend (5) /
Backend (4) / DevOps & Cloud (4), each with an `animation` style. [TechIcon](components/sections/TechIcon.tsx)
(client) renders the logo in a neutral tile and animates it on hover via Motion
variants (spin / bounce / pulse / shake), propagated from the tile so the whole
row is the hover target. Respects `prefers-reduced-motion`. The "13 tecnologías"
counter in [lib/data/site.ts](lib/data/site.ts) was updated from 12.

## Part 2 — UI icons (`lucide-animated`, animate on hover)

- Services cards: `TerminalIcon`, `RefreshCwIcon`, `CartIcon` — [ServicesSection.tsx](components/sections/ServicesSection.tsx).
- Contact email: `AtSignIcon` — [Contact.tsx](components/sections/Contact.tsx); submit button: `SendIcon` — [ContactForm.tsx](components/sections/ContactForm.tsx).
- Navbar hamburger/close: `MenuIcon` / `XIcon` — [Navbar.tsx](components/layout/Navbar.tsx).

## Part 3 — Career-timeline nodes (`lucide-animated`, triggered on flash)

The 3 existing milestones (Dedalus, BBVA, Verti — there is no "Izertis" in the
data) get an animated icon in their node card: `FolderCodeIcon`, `CreditCardIcon`,
`UsersIcon` ([lib/data/timeline.tsx](lib/data/timeline.tsx)). [ScrollStoryPath](components/animation/ScrollStoryPath.tsx)
holds a ref to each icon handle and calls `startAnimation()` once, in sync with
the node's arrival flash (skipped under reduced motion).

## Notes

- **Bundle**: `developer-icons` and `lucide-animated` are single barrels, so they
  were added to `optimizePackageImports` in [next.config.js](next.config.js) to
  stay tree-shaken (same reason `lucide-react` is there; see brand.tsx history).
- **Tests/Jest**: these packages ship ESM (developer-icons has no CJS build).
  next/jest hard-codes a blanket `/node_modules/` transform-ignore, so
  [jest.config.ts](jest.config.ts) awaits the resolved config and rewrites
  `transformIgnorePatterns` to let them through SWC.
- **Legal**: tech logos keep their official brand colours (developer-icons is
  MIT, identification use). Career-timeline icons remain generic/brand-neutral —
  never company logos.
