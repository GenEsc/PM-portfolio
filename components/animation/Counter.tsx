"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
  /** Final value to count up to. */
  value: number;
  /** Optional suffix rendered after the number (e.g. "+", "%"). */
  suffix?: string;
  /** Stagger delay before the count begins, in ms. */
  delay?: number;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
};

/** easeOutCubic: fast start, gentle settle. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 up to `value` once the element enters the viewport.
 * Animates a single time (hasAnimated flag) and stops exactly at `value`.
 */
export default function Counter({
  value,
  suffix = "",
  delay = 0,
  duration = 1200,
  className = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const run = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const start = performance.now() + delay;
      let frame = 0;

      const tick = (now: number) => {
        const elapsed = now - start;
        if (elapsed < 0) {
          frame = requestAnimationFrame(tick);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        setDisplay(Math.round(easeOutCubic(progress) * value));
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setDisplay(value); // land exactly on target
        }
      };

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
