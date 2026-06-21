"use client";

import { useEffect, useRef } from "react";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { MILESTONES, type Milestone } from "@/lib/data/timeline";

/** Vertical centre of each node, as a percentage of the desktop track height. */
const NODE_Y = [12.5, 37.5, 62.5, 87.5];

/**
 * "Trayectoria" — the career timeline that doubles as the scroll path.
 *
 * A bold emerald path is drawn on scroll (the same `stroke-dashoffset` + lerp
 * mechanism as the rest of the site) and connects four career milestones
 * (BBVA → Dedalus → Izertis → Verti). It begins only here — below the hero —
 * so the hero stays clean, and its colour deepens toward the bottom, leading
 * the eye toward the green contact section where the journey "arrives".
 *
 * The path uses `pathLength="1"` so the draw is exactly proportional to scroll
 * progress regardless of how the SVG is stretched, and `non-scaling-stroke`
 * keeps the line a constant, bold width. Desktop weaves the path left↔right
 * between alternating cards; mobile collapses to a thinner straight rail.
 */
export default function CareerTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const paths = Array.from(
      section.querySelectorAll<SVGPathElement>("[data-draw]")
    );
    if (paths.length === 0) return;

    // pathLength=1 normalises the geometry: a single dash of length 1 covers the
    // whole path; offset 1 = undrawn, offset 0 = fully drawn.
    paths.forEach((p) => {
      p.style.strokeDasharray = "1";
      p.style.strokeDashoffset = "1";
    });

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      // Start drawing as the section's top reaches 80% of the viewport and keep
      // drawing until it has travelled most of the way up the screen.
      const span = rect.height + vh * 0.6;
      const traveled = vh * 0.8 - rect.top;
      return span > 0 ? Math.min(Math.max(traveled / span, 0), 1) : 1;
    };

    const LERP = 0.08;
    let target = 1 - computeProgress();
    let current = 1;

    const apply = (value: number) => {
      paths.forEach((p) => {
        p.style.strokeDashoffset = `${value}`;
      });
    };

    let raf = 0;
    const animate = () => {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.001) current = target;
      apply(current);
      raf = window.requestAnimationFrame(animate);
    };

    const onScroll = () => {
      target = 1 - computeProgress();
      if (reduceMotion) {
        current = target;
        apply(current);
      }
    };

    onScroll();
    if (!reduceMotion) raf = window.requestAnimationFrame(animate);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="trayectoria"
      ref={sectionRef}
      className="scroll-mt-[70px] overflow-hidden py-24 sm:py-28"
    >
      <div className="container-page">
        <AnimateOnScroll>
          <p className="section-eyebrow">Trayectoria</p>
          <h2 className="mt-3 font-display text-h2-mobile font-bold text-content sm:text-h2">
            El camino hasta aquí
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-content-muted">
            Cada etapa ha sumado experiencia real en entornos exigentes, hasta
            liderar hoy un equipo como Tech Lead.
          </p>
        </AnimateOnScroll>

        {/* Desktop: weaving path between alternating cards. */}
        <div className="mt-16 hidden md:block">
          <TimelineDesktop />
        </div>

        {/* Mobile: thinner straight rail with stacked cards. */}
        <div className="mt-12 md:hidden">
          <TimelineMobile />
        </div>
      </div>
    </section>
  );
}

function TimelineDesktop() {
  return (
    <div className="relative h-[820px]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="timeline-grad-d" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <path
          data-draw
          data-testid="timeline-path"
          pathLength={1}
          d="M50 0 C50 6 38 8 38 12.5 C38 22 62 28 62 37.5 C62 50 38 52 38 62.5 C38 75 62 78 62 87.5 C62 93 50 95 50 100"
          stroke="url(#timeline-grad-d)"
          strokeWidth={7}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {MILESTONES.map((milestone, i) => {
        const y = NODE_Y[i];
        const onLeft = i % 2 === 0;
        const bowX = onLeft ? 38 : 62;
        return (
          <div key={milestone.company}>
            {/* Node dot sitting on the path. */}
            <span
              aria-hidden="true"
              className="absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-surface bg-accent"
              style={{ left: `${bowX}%`, top: `${y}%` }}
            />
            {/* Card, on the same side the path bows toward. */}
            <div
              className={`absolute w-[38%] -translate-y-1/2 ${
                onLeft ? "left-0 pr-6" : "right-0 pl-6"
              }`}
              style={{ top: `${y}%` }}
            >
              <AnimateOnScroll delay={i * 50} className="w-full">
                <MilestoneCard milestone={milestone} />
              </AnimateOnScroll>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineMobile() {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        className="absolute left-[10px] top-0 h-full w-3"
        viewBox="0 0 10 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="timeline-grad-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <path
          data-draw
          data-testid="timeline-path-mobile"
          pathLength={1}
          d="M5 0 L5 100"
          stroke="url(#timeline-grad-m)"
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ol className="space-y-7">
        {MILESTONES.map((milestone, i) => (
          <li key={milestone.company} className="relative pl-12">
            <span
              aria-hidden="true"
              className="absolute left-[16px] top-6 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent"
            />
            <AnimateOnScroll delay={i * 50}>
              <MilestoneCard milestone={milestone} />
            </AnimateOnScroll>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const Icon = milestone.icon;
  return (
    <article
      data-testid="milestone-card"
      className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent-soft text-accent dark:bg-surface-secondary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {/* Company name as styled text — never a real logo (trademark-safe). */}
        <span className="font-display text-xl font-bold tracking-tight text-content">
          {milestone.company}
        </span>
      </div>
      <p className="mt-3 text-sm text-content-muted">{milestone.role}</p>
      {milestone.note && (
        <p className="mt-1 text-xs font-medium text-accent">{milestone.note}</p>
      )}
    </article>
  );
}
