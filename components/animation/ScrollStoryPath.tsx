"use client";

import { useEffect, useRef } from "react";
import { MILESTONES } from "@/lib/data/timeline";
import type { AnimatedIconHandle } from "@/components/icons/animated";
import Logo from "@/components/layout/Logo";

/**
 * Full-page career storyline path (mindmarket-style).
 *
 * A single emerald line is "drawn" on scroll as a serpentine that weaves down
 * the page *behind* the content (z-0) and converges into the green contact
 * section. It is the visual thread that connects the career milestones.
 *
 * RESOLUTION-STABLE — two things are kept in REAL document pixels so the result
 * is identical at every resolution:
 *
 *  1. Geometry. The weave SVG's viewBox is `0 0 100 H` (H = measured pixel
 *     height of the span) with `preserveAspectRatio="none"`: x is a 0–100
 *     percentage of the width (responsive), y maps 1:1 to pixels (no vertical
 *     distortion). The path `d` is generated each measure to pass exactly
 *     through the three milestone anchors (Dedalus → BBVA → Verti), so it reads
 *     as one continuous storyline, then runs straight down into the funnel.
 *
 *  2. Drawing. The line is revealed with a CLIP rectangle whose height tracks
 *     the scroll position in document pixels (`scrollY + LEAD·vh − startDoc`),
 *     NOT by stroke-dash length. So the drawn tip always sits at the same point
 *     in the viewport and always reaches the funnel as you arrive at contact —
 *     independent of viewport height or how the path length is distributed.
 *     (The previous dash-length + `0.82·vh` model drifted with resolution: the
 *     tip separated from the funnel on large screens and ran ahead on small.)
 *
 * The milestones render as dot + label nodes in a separate overlay (z-20, above
 * content) so labels stay readable; each dot sits on its anchor (the path is
 * built through those anchors). Accessible text lives in Projects.tsx.
 *
 * ORIGIN — the line is "born" from a slowly spinning brand logo at its start
 * (the M point, top-centre), with a pulsing ring and a start badge. The logo has
 * a solid background, so the path appears to emerge from underneath it. It is
 * always visible (the anchor), not part of the scroll-drawn path. See the
 * `story-logo-spin` / `story-pulse-ring` animations in globals.css.
 *
 * CONVERGENCE — the funnel is pinned to the seam (top of #contacto) at a fixed
 * pixel height. As the revealed tip enters the last stretch it fans OPEN in
 * width (scaleX 0→1, anchored at centre), so the line expands into the section.
 *
 * Robustness — measures are coalesced through rAF (`scheduleMeasure`) so a
 * ResizeObserver can't feed back into a layout loop, and re-run on load.
 */

// Horizontal lane (% of width) for each milestone node — a gentle weave. The
// label card flips to the side that keeps it on-screen (see measure).
const NODE_X = [32, 68, 34];
// Where the drawing tip sits in the viewport (fraction of viewport height).
const LEAD = 0.6;

/** Smooth a list of [x,y] points into a cubic-bézier path (Catmull-Rom → Bézier). */
function smoothPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export default function ScrollStoryPath() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const weaveRef = useRef<SVGPathElement | null>(null);
  const revealRef = useRef<SVGRectElement | null>(null);
  const funnelRef = useRef<SVGSVGElement | null>(null);
  const particleRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLSpanElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flashRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRefs = useRef<(AnimatedIconHandle | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const overlay = overlayRef.current;
    const svg = svgRef.current;
    const weave = weaveRef.current;
    const reveal = revealRef.current;
    const funnel = funnelRef.current;
    const particle = particleRef.current;
    const pulse = pulseRef.current;
    const ripple = rippleRef.current;
    if (!wrap || !overlay || !svg || !weave || !reveal || !funnel) return;

    // One-time animation flags (never re-trigger on scroll-up, per site rule).
    let confluenceTriggered = false;
    const flashed = MILESTONES.map(() => false);

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const docTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top + window.scrollY;

    // Cached layout so the scroll handler never reads the DOM (no reflow).
    let startDoc = 0;
    let spanH = 1;
    let wrapW = 0; // px width of the line layer (for screen-space tangents)
    let funnelStart = 0; // px from the top of the span where the funnel begins
    let nodeY: number[] = [];

    const positionLayer = (el: HTMLElement) => {
      el.style.top = `${startDoc}px`;
      el.style.height = `${spanH}px`;
    };

    const measure = () => {
      const start = document.getElementById("sobre-mi");
      const end = document.getElementById("contacto");
      if (!start || !end) return;
      startDoc = docTop(start);
      spanH = Math.max(docTop(end) - startDoc, 1); // top of contact = funnel base

      positionLayer(wrap);
      positionLayer(overlay);
      wrapW = wrap.clientWidth || window.innerWidth || 1;
      // Real-pixel viewBox: x is 0–100 (% of width), y is 1:1 px (no distortion).
      svg.setAttribute("viewBox", `0 0 100 ${spanH}`);
      reveal.setAttribute("width", "100");

      // Milestone Y positions (px within the span), from the Proyectos track so
      // the line literally threads through the rendered nodes.
      const track = document.getElementById("trayectoria-track");
      const n = MILESTONES.length;
      nodeY = track
        ? MILESTONES.map(
            (_, i) =>
              docTop(track) - startDoc + ((i + 0.5) / n) * track.offsetHeight
          )
        : MILESTONES.map((_, i) => spanH * (0.42 + 0.16 * i));

      // Anchors: gentle top weave → the three milestones → straight tail down
      // into the funnel mouth at the seam.
      const tail = Math.min(200, spanH * 0.22);
      const firstY = nodeY[0];
      const pts: [number, number][] = [
        [50, 0],
        [70, Math.max(firstY * 0.4, 1)],
        [30, Math.max(firstY * 0.72, 2)],
      ];
      MILESTONES.forEach((_, i) => pts.push([NODE_X[i], nodeY[i]]));
      pts.push([50, Math.max(spanH - tail, nodeY[n - 1] + 40)]);
      weave.setAttribute("d", `${smoothPath(pts)} L50 ${spanH}`);

      funnelStart = spanH - 150; // matches the funnel's fixed pixel height

      // Place the dot + card for each milestone exactly on its anchor.
      MILESTONES.forEach((_, i) => {
        const node = nodeRefs.current[i];
        const card = cardRefs.current[i];
        if (!node) return;
        node.style.top = `${(nodeY[i] / spanH) * 100}%`;
        node.style.left = `${NODE_X[i]}%`;
        if (card) {
          if (NODE_X[i] <= 50) {
            card.style.left = "22px";
            card.style.right = "auto";
          } else {
            card.style.right = "22px";
            card.style.left = "auto";
          }
        }
      });
    };

    // Document-pixel position the drawing tip should reach for the current scroll.
    const targetReveal = () => {
      const tip = window.scrollY + (window.innerHeight || 0) * LEAD - startDoc;
      return Math.min(Math.max(tip, 0), spanH);
    };

    let target = 0;
    let current = 0;
    let running = false;
    let raf = 0;

    // Point on the weave where its y matches `ty` (the drawn tip). Binary-search
    // by length since the path is monotonic in y. Null when geometry isn't
    // available (jsdom). Used to ride the travelling particle on the tip.
    const pointAtY = (ty: number): DOMPoint | null => {
      try {
        if (typeof weave.getTotalLength !== "function") return null;
        const total = weave.getTotalLength();
        if (!total) return null;
        let lo = 0;
        let hi = total;
        for (let i = 0; i < 16; i++) {
          const mid = (lo + hi) / 2;
          if (weave.getPointAtLength(mid).y < ty) lo = mid;
          else hi = mid;
        }
        return weave.getPointAtLength((lo + hi) / 2);
      } catch {
        return null;
      }
    };

    const apply = (y: number) => {
      // Reveal the line from the top down to the scroll-driven tip (px).
      reveal.setAttribute("height", `${y}`);
      // Funnel fans open in width as the tip crosses its zone.
      const r = Math.min(Math.max((y - funnelStart) / 150, 0), 1);
      funnel.style.transform = `scaleX(${r})`;

      const progress = spanH > 0 ? y / spanH : 0;

      // Animation 1 — travelling particle riding just at the drawn tip.
      if (particle && !reduceMotion) {
        const pt = progress > 0.02 && progress < 0.98 ? pointAtY(y) : null;
        if (pt) {
          particle.style.left = `${pt.x}%`;
          particle.style.top = `${(pt.y / spanH) * 100}%`;
          particle.style.opacity = "1";
        } else {
          particle.style.opacity = "0";
        }
      }

      // Reveal each milestone node once the line reaches it, and fire its
      // Animation 2 — arrival flash — exactly once.
      for (let i = 0; i < nodeY.length; i++) {
        const node = nodeRefs.current[i];
        if (node) node.style.opacity = y >= nodeY[i] ? "1" : "0";
        if (y >= nodeY[i] && !flashed[i]) {
          flashed[i] = true;
          flashRefs.current[i]?.classList.add("is-flashing");
          // Fire the node's animated icon once, in sync with the flash.
          if (!reduceMotion) iconRefs.current[i]?.startAnimation();
        }
      }

      // Animation 3 — confluence. Once the path nearly reaches contact, flood
      // the whole #contacto section green (permanent — it stays green, handled
      // by the `.is-confluent` CSS in globals.css) and play a decorative ripple
      // at the arrival point. NOT a node flash: this is a permanent state change.
      if (!confluenceTriggered && progress >= 0.96) {
        confluenceTriggered = true;
        ripple?.classList.add("is-rippling");
        document.getElementById("contacto")?.classList.add("is-confluent");
      }
    };

    // Fix 1 — idle particle. When the user stops scrolling, a particle travels
    // autonomously from the origin to the current drawn tip and loops, so the
    // path always looks "alive". While scrolling, the scroll-driven particle in
    // apply() takes over. Same element, different driver.
    let isScrolling = false;
    let scrollIdleTimer = 0;
    let idleRaf = 0;
    let idleY = 0; // px down the drawn line (CONSTANT speed, not constant time)
    const IDLE_V = 6; // px per frame — constant travel speed of the segment
    // Stop the idle energy once the line has essentially arrived (≥ this much of
    // the span drawn): no segment lingering inside the contact area.
    const IDLE_MAX = 0.95;

    // Only animate while the storyline is on screen (the viewport is static when
    // idle, so a single check is enough) — no wasted work elsewhere.
    const storyInView = () => {
      const top = window.scrollY;
      const bottom = top + (window.innerHeight || 0);
      return bottom > startDoc && top < startDoc + spanH;
    };

    const runIdle = () => {
      if (isScrolling || reduceMotion || !pulse) return;
      if (current < spanH * 0.02 || current >= spanH * IDLE_MAX) {
        pulse.style.opacity = "0";
        return;
      }
      idleY += IDLE_V; // constant px/frame, so speed is the same on any length
      if (idleY > current) idleY = 0;
      const pt = pointAtY(idleY);
      const fwd = pointAtY(Math.min(idleY + 8, current));
      if (pt && fwd) {
        // Orient the short segment along the line in SCREEN space (x is % of
        // width, so convert before measuring the tangent angle).
        const dx = ((fwd.x - pt.x) / 100) * wrapW;
        const dy = fwd.y - pt.y;
        const angle =
          Math.abs(dx) + Math.abs(dy) < 0.001
            ? 90
            : (Math.atan2(dy, dx) * 180) / Math.PI;
        pulse.style.left = `${pt.x}%`;
        pulse.style.top = `${pt.y}px`;
        pulse.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        pulse.style.opacity = "1";
      }
      idleRaf = window.requestAnimationFrame(runIdle);
    };

    const maybeStartIdle = () => {
      if (isScrolling || running || reduceMotion || !storyInView()) return;
      if (current < spanH * 0.02 || current >= spanH * IDLE_MAX) return;
      idleY = 0;
      if (idleRaf) window.cancelAnimationFrame(idleRaf);
      idleRaf = window.requestAnimationFrame(runIdle);
    };

    // Cap how fast the drawn tip can travel (px/frame). On a quick scroll the
    // line keeps drawing at this speed instead of snapping, so it doesn't rush
    // through the milestones and each arrival flash has time to be seen. Normal
    // reading scroll stays under the cap, so it feels 1:1.
    const MAX_DRAW_V = 10;

    const tick = () => {
      const step = (target - current) * 0.16;
      current += Math.max(-MAX_DRAW_V, Math.min(MAX_DRAW_V, step));
      if (Math.abs(target - current) < 0.5) {
        current = target;
        running = false;
      }
      apply(current);
      if (running) raf = window.requestAnimationFrame(tick);
      else if (!isScrolling) maybeStartIdle();
    };

    const ensureRunning = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      // Scroll active → pause the idle particle; resume it 150ms after the last
      // scroll event (i.e. once the user has stopped).
      isScrolling = true;
      if (idleRaf) {
        window.cancelAnimationFrame(idleRaf);
        idleRaf = 0;
      }
      if (pulse) pulse.style.opacity = "0";
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
        maybeStartIdle();
      }, 150);

      target = targetReveal();
      if (reduceMotion) {
        current = target;
        apply(current);
      } else {
        ensureRunning();
      }
    };

    // Coalesce measures through rAF so a ResizeObserver can't loop synchronously.
    let scheduled = false;
    const scheduleMeasure = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        measure();
        target = targetReveal();
        current = target;
        apply(current);
      });
    };

    measure();
    target = targetReveal();
    current = target;
    apply(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("load", scheduleMeasure);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(scheduleMeasure);
      ro.observe(document.body);
    }

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      if (idleRaf) window.cancelAnimationFrame(idleRaf);
      window.clearTimeout(scrollIdleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
      ro?.disconnect();
    };
  }, []);

  return (
    <>
      {/* Line layer — behind the content. */}
      <div
        ref={wrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 z-0 text-accent"
      >
        {/* Weave: serpentine line threading through the milestones, ending in a
            straight centred vertical that expands into the funnel below. Its
            `d`, `viewBox` and reveal `height` are set in real pixels at runtime
            (see measure / apply). */}
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <clipPath id="story-reveal" clipPathUnits="userSpaceOnUse">
              {/* Height animated 0 → H to reveal the line from the top down. */}
              <rect
                ref={revealRef}
                data-testid="story-reveal"
                x="0"
                y="0"
                width="100"
                height="0"
              />
            </clipPath>
          </defs>
          <path
            ref={weaveRef}
            data-testid="story-path"
            d="M50 0 L50 1000"
            clipPath="url(#story-reveal)"
            stroke="currentColor"
            strokeWidth={6}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Convergence funnel pinned to the seam (top edge of #contacto) at a
            FIXED height, living in the empty bottom padding of the previous
            section. As the revealed tip enters its zone it fans OPEN in width
            (scaleX, anchored at centre) from the straight line out to the full
            section width — so the line itself appears to expand into the
            section. Same emerald as the contact top, so it merges seamlessly. */}
        <svg
          ref={funnelRef}
          className="absolute inset-x-0 bottom-0 h-[150px] w-full origin-center will-change-transform"
          style={{ transform: "scaleX(0)" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            data-testid="story-funnel"
            d="M50 0 C46 35, 30 75, 0 100 L100 100 C70 75, 54 35, 50 0 Z"
            fill="currentColor"
          />
        </svg>

        {/* Idle energy: a short, darker segment of the line (line-width wide)
            that travels to the drawn tip while the user is idle. Lives in the
            line layer so it sits on the line and is occluded by content too. */}
        <div
          ref={pulseRef}
          data-testid="story-pulse"
          aria-hidden="true"
          className="story-pulse absolute h-[10px] w-[9px] rounded-full bg-accent-hover opacity-0"
          style={{ left: "50%", top: "0px" }}
        />
      </div>

      {/* Node layer — above the content so the labels stay readable. Holds the
          three career milestones as dot+label nodes sitting on the line. */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 z-20"
      >
        {/* Origin: the storyline is "born" from a slowly spinning brand logo at
            the line's start (its M point, top-centre). The logo has a solid
            background so the line emerges from underneath it. A pulsing ring and
            a start badge mark it as the anchor. Always visible; not part of the
            scroll-drawn path. */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <span className="story-pulse-ring absolute inset-0 rounded-full border-[1.5px] border-accent" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-[var(--bg)] sm:h-[72px] sm:w-[72px]">
            <Logo className="story-logo-spin h-7 w-7 text-accent sm:h-9 sm:w-9" />
          </span>
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-hover">
            2019 · Inicio
          </span>
        </div>

        {MILESTONES.map((m, i) => {
          const Icon = m.icon;
          return (
          <div
            key={m.company}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            data-testid={`story-node-${i}`}
            className="absolute opacity-0 transition-opacity duration-500 ease-out"
            style={{ left: "50%", top: "0%" }}
          >
            {/* Animation 2 — arrival flash, expands from the dot exactly once. */}
            <span
              ref={(el) => {
                flashRefs.current[i] = el;
              }}
              className="story-node-flash absolute -left-[30px] -top-[30px] block h-[60px] w-[60px] rounded-full bg-accent"
            />
            {/* Dot centred exactly on the milestone's anchor on the line. */}
            <span className="absolute -left-[9px] -top-[9px] block h-[18px] w-[18px] rounded-full bg-accent shadow-md ring-[5px] ring-surface" />
            {/* Label card beside the dot, vertically centred on the point. */}
            <div
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute top-1/2 w-56 -translate-y-1/2 rounded-xl border border-line bg-surface/95 p-4 shadow-md backdrop-blur sm:w-64"
              style={{ left: "22px" }}
            >
              <div className="flex items-center gap-2">
                {/* Animated milestone icon — fired once when the node flashes
                    in (see iconRefs.startAnimation in apply). */}
                <Icon
                  ref={(el) => {
                    iconRefs.current[i] = el;
                  }}
                  size={20}
                  animateOnHover={false}
                  className="shrink-0 text-accent"
                />
                <p className="font-display text-sm font-bold leading-tight text-content">
                  {m.company}{" "}
                  <span className="font-semibold text-content-muted">
                    · {m.year}
                  </span>
                </p>
              </div>
              <p className="mt-1 text-xs font-semibold text-accent">{m.role}</p>
              <p className="mt-1.5 text-xs leading-snug text-content-muted">
                {m.summary}
              </p>
            </div>
          </div>
          );
        })}

        {/* Animation 1 — travelling particle riding the drawn tip: a solid core
            plus a larger, fainter halo (no CSS blur). Positioned each frame. */}
        <div
          ref={particleRef}
          data-testid="story-particle"
          className="story-particle absolute opacity-0 transition-opacity duration-200"
          style={{ left: "50%", top: "0%" }}
        >
          <span className="absolute -left-[9px] -top-[9px] block h-[18px] w-[18px] rounded-full bg-accent/25" />
          <span className="absolute -left-[5px] -top-[5px] block h-[10px] w-[10px] rounded-full bg-accent" />
        </div>

        {/* Animation 3 — confluence ripple at the arrival point (top of contact,
            i.e. the overlay's bottom-centre / funnel base). Fires once. */}
        <span
          ref={rippleRef}
          className="story-ripple absolute bottom-0 left-1/2 -ml-[50px] -mb-[50px] block h-[100px] w-[100px] rounded-full bg-white/25"
        />
      </div>
    </>
  );
}
