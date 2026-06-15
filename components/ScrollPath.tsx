"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative background path.
 *
 * A fixed, full-viewport SVG sitting behind all content. The organic path
 * (soft curves + one closed loop / "tirabuzón") is progressively drawn as the
 * user scrolls down, using `stroke-dashoffset` updated on the scroll event.
 *
 * Color and opacity come from CSS variables (--path-stroke / --path-opacity)
 * so it adapts to light/dark; opacity is reduced further on mobile via CSS.
 */
export default function ScrollPath() {
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    let ticking = false;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(Math.max(progress, 0), 1);
      path.style.strokeDashoffset = `${length * (1 - clamped)}`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update(); // initial draw state
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-testid="scroll-path"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          data-testid="scroll-path-line"
          className="scroll-path-stroke"
          strokeWidth={2.5}
          strokeLinecap="round"
          d="M520 -40
             C 760 120, 720 300, 520 360
             C 320 420, 240 520, 360 600
             C 470 660, 560 560, 470 510
             C 410 478, 330 520, 380 600
             C 420 665, 560 690, 600 780
             C 660 880, 470 960, 520 1080"
        />
      </svg>
    </div>
  );
}
