/**
 * JavaScript-controlled smooth scroll with easing.
 *
 * Replaces CSS `scroll-behavior: smooth` (abrupt, browser-dependent, no easing
 * control) with a momentum-based animation that feels natural.
 */

/** Slow start, fast middle, gentle settle. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Scale the duration with distance: short jumps feel snappy (min 500ms),
 * long jumps feel cinematic (max 1200ms).
 */
export function scrollDurationFor(distance: number): number {
  return Math.min(Math.max(Math.abs(distance) / 3, 500), 1200);
}

/** Whether the user asked the OS to reduce motion. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/**
 * Animate the window scroll to `targetY` using easeInOutCubic.
 * Duration defaults to a distance-based value. Honors reduced-motion by
 * jumping straight to the target.
 */
export function smoothScrollTo(targetY: number, duration?: number): void {
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY);
    return;
  }

  const dur = duration ?? scrollDurationFor(distance);
  let startTime: number | null = null;

  function step(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / dur, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
