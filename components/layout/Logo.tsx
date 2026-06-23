type LogoProps = {
  className?: string;
  title?: string;
};

/**
 * Brand mark: a circle with a central node and 12 spokes ending in dots —
 * evoking network nodes / system architecture / connectivity.
 *
 * Rendered inline with `currentColor` so it follows the text color:
 *  - emerald (`text-accent`) on light backgrounds
 *  - white on dark backgrounds
 *
 * Pedro can replace this with his official asset at /public/logo.svg; this
 * component is used in the UI for crisp, color-adaptive rendering.
 */
export default function Logo({ className = "", title = "Logo" }: LogoProps) {
  const center = 50;
  const dotRadius = 34; // distance of each dot from center
  const spokeStart = 13; // where each spoke begins (just outside the hub)
  // Round coordinates so the serialized SVG is byte-identical on server and
  // client. `Math.sin`/`Math.cos` may differ by 1 ULP between the Node and
  // browser engines, which otherwise triggers a hydration mismatch warning.
  const r = (n: number) => Math.round(n * 1e4) / 1e4;
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return {
      x1: r(center + spokeStart * sin),
      y1: r(center - spokeStart * cos),
      x2: r(center + dotRadius * sin),
      y2: r(center - dotRadius * cos),
    };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle cx={center} cy={center} r={46} stroke="currentColor" strokeWidth={4} />
      {/* Spokes */}
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}
      {/* Dots at the end of each spoke */}
      {spokes.map((s, i) => (
        <circle key={`d-${i}`} cx={s.x2} cy={s.y2} r={4.5} fill="currentColor" />
      ))}
      {/* Central hub (ring) */}
      <circle cx={center} cy={center} r={6.5} stroke="currentColor" strokeWidth={4} />
    </svg>
  );
}
