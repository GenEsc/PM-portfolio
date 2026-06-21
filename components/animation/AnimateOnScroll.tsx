"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

type AnimateOnScrollProps = {
  children: ReactNode;
  /** Render as a different element (default: div). */
  as?: ElementType;
  /** Stagger delay in ms (50ms between siblings is the project convention). */
  delay?: number;
  className?: string;
};

/**
 * Wraps content with the "pop" enter animation:
 * scale(0.75) + opacity(0) -> scale(1) + opacity(1), 400ms gentle bounce.
 *
 * Once visible it STAYS visible — the observer disconnects after the first
 * intersection so scrolling back up never re-animates (hasAnimated flag).
 *
 * Uses IntersectionObserver with threshold 0.15.
 */
export default function AnimateOnScroll({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (e.g. very old browsers / jsdom): show at once.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // hasAnimated: never re-animate.
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${visible ? "pop-in" : "pop-init"} ${className}`}
      style={visible && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
