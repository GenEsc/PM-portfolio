# Animations

Every animation in the project, with the exact easings and logic so they can be
modified without guessing. All effects use **native CSS + `IntersectionObserver`**
(no animation libraries). They respect `prefers-reduced-motion` via a global
override in `app/globals.css`.

---

## 1. Pop on scroll (enter animation)

**Where:** `components/AnimateOnScroll.tsx`, CSS in `app/globals.css`
(`.pop-init` / `.pop-in`).

- From: `opacity: 0; transform: scale(0.75)` (`.pop-init`)
- To: `opacity: 1; transform: scale(1)` (`.pop-in`)
- Duration: **400ms**
- Easing: **`cubic-bezier(0.34, 1.56, 0.64, 1)`** (gentle bounce)
- Stagger: pass `delay` (ms) — the project convention is **50ms** between
  siblings (`delay={i * 50}`), applied as `transition-delay`.

**Logic:** an `IntersectionObserver` with `threshold: 0.15` watches the wrapper.
On first intersection it sets `visible = true` (swapping `.pop-init` → `.pop-in`)
and **calls `observer.disconnect()`** — so once an element has appeared it stays
visible forever and never re-animates on scroll-up (the `hasAnimated` rule).

```tsx
<AnimateOnScroll delay={index * 50}>...</AnimateOnScroll>
```

To change the feel, edit the `transition` in `.pop-in` (globals.css). To change
when it triggers, edit the `threshold`.

---

## 2. Animated counters

**Where:** `components/Counter.tsx`. Used in the About section.

- Counts from **0** to `value`.
- Duration: **1200ms** (default `duration` prop).
- Easing: **`easeOutCubic`** → `1 - Math.pow(1 - t, 3)`.
- Stagger between counters: **200ms** (`delay={i * 200}` in `About.tsx`).
- Animates **once** (an internal `hasAnimated` ref) and lands **exactly** on the
  target value.

**Logic:** an `IntersectionObserver` (`threshold: 0.15`) starts a
`requestAnimationFrame` loop when the element enters the viewport. Each frame
computes `progress = elapsed / duration`, applies `easeOutCubic`, and sets the
displayed value; on completion it snaps to `value` and the observer disconnects.

---

## 3. Navbar hide/show on scroll

**Where:** `components/Navbar.tsx` + `hooks/useScrollDirection.ts`.

- **Scroll down** (and not at top): navbar hides via `transform: translateY(-100%)`.
- **Scroll up** (any amount): navbar reappears immediately.
- **At top** (`scrollY === 0`): transparent, no background/border.
- **Scrolled:** solid background with `backdrop-filter: blur(12px)` and a subtle
  bottom border.
- Transition: **300ms** on `transform` and `background`.
- The navbar is `position: fixed; top: 0` (sticky behaviour).

**Logic:** `useScrollDirection` compares `window.scrollY` between frames
(throttled with `requestAnimationFrame`) to derive `direction` and `atTop`.
`Navbar` computes `hidden = direction === "down" && !atTop && !menuOpen` and
`solid = !atTop || menuOpen`, exposed as `data-hidden` / `data-solid` (also used
by tests).

---

## 4. Active navbar link

**Where:** `hooks/useActiveSection.ts` + `components/Navbar.tsx`.

The active section's link is highlighted in emerald (`text-accent`).

**Logic:** a single `IntersectionObserver` observes all sections with
`rootMargin: "-30% 0px -55% 0px"` and multiple thresholds. The section with the
largest `intersectionRatio` wins and its link gets `data-active="true"` +
`aria-current`.

---

## 5. Cursor parallax (hero only)

**Where:** `components/Hero.tsx`.

Decorative circles and floating tech icons move **opposite** to the cursor to
create depth. Active only in the hero and only on fine-pointer (non-touch)
devices (`matchMedia("(pointer: fine)")`).

Depth factors (the `data-parallax` attribute):

| Layer              | Factor  |
| ------------------ | ------- |
| Large circles      | `0.02`  |
| Small circles      | `0.035` |
| Tech icons         | `0.045` |

- Transition: **`transform 0.15s ease`** for smoothing.
- On `mousemove`, offset is computed relative to the hero's center:
  `translate(-dx * factor, -dy * factor)`.

To add a parallax element, give it `data-parallax="<factor>"` inside the hero.

---

## 6. Scroll-drawn background path

**Where:** `components/ScrollPath.tsx`, CSS `.scroll-path-stroke` in globals.

A fixed, full-viewport SVG sits behind all content (`-z-10`,
`pointer-events: none`). The organic path has soft curves and **one closed loop
("tirabuzón")**.

- Color/opacity via CSS vars: `--path-stroke` / `--path-opacity`
  (light: `#1D9E75` @ 12%, dark: `#5DCAA5` @ 15%, mobile reduced to 8%).
- **Draw-on-scroll (lerp):** on mount the path length is read with
  `getTotalLength()` and set as `stroke-dasharray`. The scroll event only updates
  a **target** offset (`length * (1 - progress)`, where
  `progress = scrollY / (scrollHeight - clientHeight)`). A continuous
  `requestAnimationFrame` loop interpolates the **current** offset toward the
  target each frame:

  ```js
  currentOffset += (targetOffset - currentOffset) * 0.08; // lerp factor
  ```

  This makes the drawing lag slightly behind the scroll for a fluid, organic
  feel instead of snapping to position. Tune the **lerp factor** between `0.05`
  (very lazy) and `0.12` (more responsive); it snaps to the target once within
  0.5px so it settles cleanly. Decoupling from the scroll event also avoids the
  jerkiness of doing layout work on every scroll tick.

To redraw the shape, edit the `d` attribute of the `<path>`.

---

## 7. Availability badge pulse

**Where:** `components/Hero.tsx` + `tailwind.config.ts` keyframes.

A green dot pulses infinitely. Keyframe `pulse` animates `scale` (1 → 1.6) and
`opacity` (1 → 0.4); exposed as the `animate-pulse-dot` utility
(`1.8s ease-in-out infinite`).

---

## 8. Smooth scroll (JS momentum)

**Where:** `lib/smoothScroll.ts` + `components/SmoothScroll.tsx`.

CSS `scroll-behavior: smooth` is **not** used (abrupt, browser-dependent, no
easing control). Instead, `components/SmoothScroll.tsx` mounts a single delegated
click listener that intercepts in-page anchor clicks (`<a href="#...">`) and
animates the scroll in JS:

- **Easing:** `easeInOutCubic` — slow start, fast middle, gentle settle.
- **Duration:** distance-based, `Math.min(Math.max(|distance| / 3, 500), 1200)`
  ms — short jumps feel snappy, long jumps cinematic.
- **Offset:** target is `element top − 70px` (`SCROLL_OFFSET`) so content clears
  the fixed navbar; the URL hash is kept in sync via `history.pushState`.
- **Reduced motion:** jumps straight to the target.

`scroll-padding-top: 70px` remains in CSS as a no-JS fallback for native anchor
jumps.

---

## 9. Hero page-entry animation

**Where:** `components/Hero.tsx` + `.hero-enter` keyframes in `app/globals.css`.

On first load the hero elements fade + slide up in a staggered sequence. Built
with CSS `@keyframes heroEnter` (not JS) so it runs without hydration and
degrades gracefully.

- From: `opacity: 0; transform: translateY(16px)` → to `opacity: 1; translateY(0)`.
- Duration: **0.6s**, easing **`cubic-bezier(0.22, 1, 0.36, 1)`**, `forwards`.
- Stagger (`animation-delay` per element): **name 0ms · tagline 150ms · badge
  300ms · CTAs 450ms**.

---

## 10. Navbar active link transition

Navbar links use `transition-colors duration-300 ease-out` so the active section
highlight fades softly (≈`color 0.3s ease`) rather than swapping instantly. See
section 4 for how the active section is detected.
