"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Secondary CTA whose accent outline draws itself clockwise from the exact point
 * where the cursor enters, and retracts in reverse on leave. The path is built
 * point-by-point around the button perimeter (not via stroke-dashoffset, which
 * can't offset the start on a rounded shape) and eased with a rAF lerp.
 *
 * These buttons are pills, so the corner radius is the half-height (`R = H/2`):
 * the four 90° arcs plus zero-length side edges trace a stadium. Polymorphic —
 * `<a>` when `href` is given, else `<button>`. Honors `prefers-reduced-motion`
 * (shows the full outline instantly, no draw).
 */
type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

type Box = { w: number; h: number; r: number };

const perimeter = ({ w, h, r }: Box) =>
  2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;

/** Point at clockwise distance `dist` from the top edge start, around the pill. */
function pointAt(dist: number, { w, h, r }: Box): { x: number; y: number } {
  const arc = (Math.PI / 2) * r;
  const topEdge = w - 2 * r;
  const sideEdge = h - 2 * r;
  const segments = [
    { arc: false, len: topEdge, x1: r, y1: 0, dx: 1, dy: 0 }, // top
    { arc: true, len: arc, cx: w - r, cy: r, a0: -Math.PI / 2 }, // top-right
    { arc: false, len: sideEdge, x1: w, y1: r, dx: 0, dy: 1 }, // right
    { arc: true, len: arc, cx: w - r, cy: h - r, a0: 0 }, // bottom-right
    { arc: false, len: topEdge, x1: w - r, y1: h, dx: -1, dy: 0 }, // bottom
    { arc: true, len: arc, cx: r, cy: h - r, a0: Math.PI / 2 }, // bottom-left
    { arc: false, len: sideEdge, x1: 0, y1: h - r, dx: 0, dy: -1 }, // left
    { arc: true, len: arc, cx: r, cy: r, a0: Math.PI }, // top-left
  ];

  const total = perimeter({ w, h, r });
  let remaining = ((dist % total) + total) % total;
  for (const seg of segments) {
    if (remaining <= seg.len + 0.001) {
      if (!seg.arc) {
        return { x: seg.x1! + seg.dx! * remaining, y: seg.y1! + seg.dy! * remaining };
      }
      const t = seg.len > 0 ? Math.min(remaining / seg.len, 1) : 0;
      const angle = seg.a0! + t * (Math.PI / 2);
      return { x: seg.cx! + Math.cos(angle) * r, y: seg.cy! + Math.sin(angle) * r };
    }
    remaining -= seg.len;
  }
  return { x: r, y: 0 };
}

/** Clockwise distance of the cursor's entry point, snapped to the nearest edge. */
function entryDist(x: number, y: number, { w, h, r }: Box): number {
  const arc = (Math.PI / 2) * r;
  const topEdge = w - 2 * r;
  const sideEdge = h - 2 * r;
  const rightStart = topEdge + arc;
  const bottomStart = topEdge + arc + sideEdge + arc;
  const leftStart = topEdge + arc + sideEdge + arc + topEdge + arc;

  const dTop = y;
  const dBottom = h - y;
  const dLeft = x;
  const dRight = w - x;
  const min = Math.min(dTop, dBottom, dLeft, dRight);

  if (min === dTop) {
    return Math.max(r, Math.min(x, w - r)) - r; // top edge starts at dist 0
  }
  if (min === dRight) {
    return rightStart + (Math.max(r, Math.min(y, h - r)) - r);
  }
  if (min === dBottom) {
    return bottomStart + (w - r - Math.max(r, Math.min(x, w - r)));
  }
  return leftStart + (h - r - Math.max(r, Math.min(y, h - r)));
}

function buildPath(startDist: number, progress: number, box: Box): string {
  const drawLen = progress * perimeter(box);
  if (drawLen < 1) return "";
  const steps = Math.max(4, Math.round(drawLen / 2));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const pt = pointAt(startDist + (i / steps) * drawLen, box);
    d += i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`;
  }
  return d;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function SecondaryButton({
  children,
  className = "",
  href,
  target,
  rel,
  type = "button",
  disabled,
  onClick,
  ...rest
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const state = useRef({
    box: { w: 0, h: 0, r: 0 } as Box,
    start: 0,
    current: 0,
    target: 0,
    raf: 0,
  });

  const animate = () => {
    const s = state.current;
    const path = pathRef.current;
    if (!path) return;
    const diff = s.target - s.current;
    if (Math.abs(diff) < 0.001) {
      s.current = s.target;
      path.setAttribute("d", buildPath(s.start, s.current, s.box));
      return;
    }
    s.current += diff * 0.12;
    path.setAttribute("d", buildPath(s.start, s.current, s.box));
    s.raf = window.requestAnimationFrame(animate);
  };

  const handleEnter = (e: MouseEvent<HTMLElement>) => {
    const path = pathRef.current;
    if (!path) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const box: Box = { w: rect.width, h: rect.height, r: rect.height / 2 };
    const s = state.current;
    s.box = box;

    if (prefersReducedMotion()) {
      s.start = 0;
      s.current = 1;
      s.target = 1;
      path.setAttribute("d", buildPath(0, 1, box));
      return;
    }

    window.cancelAnimationFrame(s.raf);
    s.start = entryDist(e.clientX - rect.left, e.clientY - rect.top, box);
    s.current = 0;
    s.target = 1;
    animate();
  };

  const handleLeave = () => {
    const s = state.current;
    if (prefersReducedMotion()) {
      pathRef.current?.setAttribute("d", "");
      return;
    }
    window.cancelAnimationFrame(s.raf);
    s.target = 0;
    animate();
  };

  const classes = `btn-secondary relative ${className}`.trim();

  const inner = (
    <>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={onClick}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      {...rest}
    >
      {inner}
    </button>
  );
}
