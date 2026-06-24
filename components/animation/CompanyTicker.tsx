"use client";

import { useEffect, useRef } from "react";

/**
 * Inline "slot machine" ticker for the About sentence: rolls DOWNWARD through the
 * companies — the next name slides in from the top and pushes the current one down
 * and out the bottom — revealing a new one every 1.5s.
 *
 * Moving the strip down reveals progressively higher rows, so the strip is stacked
 * with each company's NEXT-in-sequence sitting directly above it: top→bottom it is
 * [clone(first), …companies reversed]. The roll runs from the bottom row up to the
 * cloned top row (an identical frame), then snaps back with no transition — a
 * seamless loop with no visible jump.
 *
 * Sizing is in `em` so it tracks the surrounding text at any font size; each item
 * is one line (1.4em) tall and the viewport clips to a single line. Honors
 * `prefers-reduced-motion` (stays on the first company). The accessible name lists
 * every company, and the rolling strip is aria-hidden so AT reads the label only.
 */
const COMPANIES = ["BBVA", "Verti", "DXC"];
const INTERVAL_MS = 1500;
const TRANSITION_MS = 450;
const LINE_EM = 1.4;

export default function CompanyTicker() {
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const inner = innerRef.current;
    if (!inner) return;

    const n = COMPANIES.length;
    // Bottom row holds the start company; offset the strip up to it so the roll
    // can travel downward toward the cloned top row.
    const offsetFor = (step: number) => `translateY(-${(n - step) * LINE_EM}em)`;
    let step = 0;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    inner.style.transform = offsetFor(0);

    const tick = () => {
      step += 1;
      inner.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      inner.style.transform = offsetFor(step);

      // Landed on the cloned top row (identical to the first company) → after the
      // roll finishes, jump back to the bottom instantly (same frame, invisible).
      if (step === n) {
        resetTimer = setTimeout(() => {
          step = 0;
          inner.style.transition = "none";
          inner.style.transform = offsetFor(0);
        }, TRANSITION_MS + 50);
      }
    };

    const timer = setInterval(tick, INTERVAL_MS);
    return () => {
      clearInterval(timer);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  // Top→bottom: a clone of the first company, then the companies reversed — so the
  // row above each one is its successor in the roll (BBVA→Verti→DXC→BBVA).
  const items = [COMPANIES[0], ...COMPANIES.slice().reverse()];

  return (
    <span
      className="inline-flex overflow-hidden align-bottom"
      style={{ height: `${LINE_EM}em` }}
      aria-label={`empresas como ${COMPANIES.join(", ")}`}
    >
      <span
        ref={innerRef}
        aria-hidden="true"
        className="flex flex-col will-change-transform"
      >
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="block whitespace-nowrap font-semibold text-accent"
            style={{
              height: `${LINE_EM}em`,
              lineHeight: `${LINE_EM}em`,
              // Outline in the page background so the green word stays legible when
              // the (same-green) storyline passes behind it — clearest on mobile.
              textShadow:
                "0 0 2px var(--bg), -1px -1px 0 var(--bg), 1px -1px 0 var(--bg), -1px 1px 0 var(--bg), 1px 1px 0 var(--bg)",
            }}
          >
            {name}
          </span>
        ))}
      </span>
    </span>
  );
}
