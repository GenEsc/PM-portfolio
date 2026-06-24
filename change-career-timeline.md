# Change request: career timeline (narrative scroll path)

## Reference
Inspired by the horizontal storyline element on [mindmarket.com](https://mindmarket.com) — a path that connects icons/milestones as the user scrolls, eventually converging into a final CTA section. This is NOT a thin background line — it's a visible, intentional storytelling element.

## Concept

A **career storyline** that tells Pedro's professional story (Dedalus → BBVA → Verti) and doubles as the scroll path. The path IS the visual guide; it runs the full page and converges into the contact section.

## Behavior

### 1. Activation point
- The path does **not** appear in the hero section.
- It starts only **after the user scrolls past the hero** (once "Sobre mí" enters the viewport).
- Before that point: no line, hero is clean.

### 2. Path drawing — UPDATED (resolution-stable)
- **Real-pixel geometry.** The weave SVG's `viewBox` is `0 0 100 H` (H = measured pixel height of the span) with `preserveAspectRatio="none"`: x is a 0–100 % of width (responsive), y is **1:1 pixels** (no vertical distortion). The path `d` is **generated each measure** as a Catmull-Rom spline through the three milestone anchors, so it threads through the rendered nodes and reads as one continuous storyline. (Earlier a fixed `0 0 100 1000` viewBox was stretched over a variable span, so the curve landed in different places at different resolutions — fixed.)
- **Scroll-driven reveal by CLIP, not dash length.** The line is revealed by an animated clip rectangle whose height tracks the scroll position **in document pixels** (`scrollY + LEAD·vh − startDoc`, `LEAD≈0.6`), eased with a lerp whose rAF loop **stops when settled**. So the drawn tip always sits at the same point in the viewport and always reaches the funnel as you arrive at contact — independent of viewport height. (The previous dash-length model drifted with resolution.)
- **Robustness.** Measures are coalesced through `requestAnimationFrame` (`scheduleMeasure`) so a `ResizeObserver` can't feed back into a layout loop (which previously froze initial load at small sizes), and re-run on `load`.
- **The line lives BEHIND the content (`z-0`), not on top of it.** Section content sits above (`z-10`) and simply occludes the line where they overlap, so the path **never covers text/words** — it threads *through* the page and peeks out in the negative space (and through the empty Proyectos track around the nodes).
- **The line is NOT a straight rail pinned to the left.** It is a **natural, weaving serpentine** that travels *through* the elements down the page, dipping to each milestone node.
- Stroke width: 6px, bold and visible (not a thin decoration).
- Colour: a **single solid emerald `--accent` (#1D9E75)** — exactly the colour at the **top** of the contact section — so the line and the funnel meet that section with no light/dark mismatch at the seam.
- To let the weave show through every section, the previously alternating solid section backgrounds (`bg-surface-secondary` on Stack / Servicios) were removed so the page shares one background.

### 3. Career milestones — UPDATED
The career story is **Dedalus → BBVA → Verti** (3 stages, chronological by start year). Izertis was removed.

| Order | Year | Company | Role (subtitle) |
|-------|------|---------|-----------------|
| 1 | 2019 | Dedalus | Full Stack Developer |
| 2 | 2024 | BBVA | Full Stack Developer · Plataforma de pagos |
| 3 | 2026 | Verti | Tech Lead |

**Node design** — each milestone is a **dot + label node sitting on the storyline**:
- **Title:** `Company · Year` (e.g. "BBVA · 2024").
- **Subtitle:** the role.
- **Body:** a one-paragraph factual summary of the position.

Data lives in `lib/data/timeline.tsx` (`MILESTONES`).

**Legal note (unchanged):**
- Do **NOT** use real company logos (BBVA, Dedalus, Verti) as image assets — registered trademarks.
- Company names are written as **plain styled text** only, paired with a **generic, neutral icon** (Lucide/Tabler, never brand-specific).
- No internal technical detail, system names or process specifics beyond the publicly confirmed "WipÖp"/"Openpay" naming. The BBVA → Openpay → WipÖp project reference is public information (confirmed by BBVA's corporate communications, bbva.com).

> Note on current layout: **all three milestones are now dot + label nodes on the storyline** (the professional cards were removed). They are distributed evenly down the Proyectos `#trayectoria-track` and live in a separate overlay layer (z-20, **above** the content) so the labels are readable. Each dot's x is **sampled from the actual weave geometry** so it lands exactly on the line, and the label card flips to whichever side keeps it on-screen. The accessible equivalent is an `sr-only` ordered list in `Projects.tsx` (correct reading order for screen readers, since the visual overlay is `aria-hidden`).

### 4. Layout
- Desktop: the path weaves left↔right down the page through the content.
- Mobile: the same weave, simplified.

### 5. Convergence into the contact section — UPDATED — CRITICAL
- The path's final destination is the **contact section** (`#contacto`).
- As the line reaches contact it must **visually "arrive"**, not just stop.
- **The line's tip opens into a funnel that grows from the tip and widens until it matches the full width of the contact section**, right at the top edge of `#contacto`. This gives the sensation that the line — and the whole story — **converges into that section**.
- **The funnel is pinned to the seam with a FIXED pixel height (~120px), so it lives in the empty bottom padding of the previous section** (Servicios, whose bottom padding was widened to `pb-40/sm:pb-44` to guarantee clearance) and is **never hidden behind that section's content**. Earlier it was sized as a % of the full scroll span, which made it ~400px tall and pushed it up behind the cards, so it was barely visible — that is fixed.
- **The weave's final stretch is a straight, centred vertical (x=50) that runs all the way down to the seam.** The funnel sits on top of it, centred.
- **The funnel opens in WIDTH, not height.** From progress 0.8 → 1.0 it animates `scaleX` from 0 → 1, anchored at its centre, so it **fans open from the straight line out to the full section width** — the line itself appears to expand into the section. (An earlier version revealed the funnel by height/clip; that left the straight line poking out below the partial funnel and reading as two separate shapes that the line slid behind. Width-fan fixes that: the funnel always covers the line's lower centre, so there is no poking and no "line disappearing behind the funnel".)
- Staging: the weave finishes drawing down to the seam by progress ≈ 0.8 (so the straight line is fully visible first); then 0.8 → 1.0 the funnel fans open — no gap and no opacity "pop".
- The funnel is the **same solid emerald (#1D9E75)** as the **top** of the contact section, so it merges into the section seamlessly (the section then continues darkening to `#0F6E56`).
- (The earlier "small filled arrival dot" was replaced by this widening funnel.)

### 6. Scroll-up behavior
- Once drawn, the line stays drawn for its scrolled extent; milestone/content pop-in animations do not re-run on scroll-up — consistent with the rest of the site.

---

## 7. Section headers ("eyebrows") — removed
The small uppercase eyebrow labels above each section heading ("Sobre mí", "Stack tecnológico", "Proyectos", "Servicios", "Contacto", and the "Experiencia profesional" card label) were removed for a cleaner look. The `<h2>` headings remain.

---

## 8. Projects section — professional experience cards
The "Proyectos" section no longer shows professional-experience cards. All three career stages (Dedalus, BBVA, Verti) are rendered as **dot + label nodes on the storyline** (see §3): company name as styled text (never a logo) + year + role + factual summary. No tech-stack tags, no demo/code links, no detail page for these. An `sr-only` list provides the accessible equivalent.

Personal demo projects (e-commerce build, legacy site modernization) will be added later as additional `personal` cards (tech chips + "Ver demo"/"Ver código"), distinguished from the professional cards. The grid already accommodates up to 4 cards.
