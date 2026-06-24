"use client";

import { useEffect, useState } from "react";

export type ScrollState = {
  /** Current vertical scroll position in px. */
  scrollY: number;
  /** Direction of the last scroll movement. */
  direction: "up" | "down";
  /** True while at the very top of the page (scrollY === 0). */
  atTop: boolean;
};

/**
 * Tracks vertical scroll position and direction.
 * Used by the Navbar to hide on scroll-down and reappear on scroll-up.
 */
export function useScrollDirection(): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    direction: "up",
    atTop: true,
  });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      // Ignore sub-pixel jitter and rubber-banding past the top.
      const delta = currentY - lastY;
      const direction = delta > 0 ? "down" : "up";

      setState({
        scrollY: currentY,
        direction: Math.abs(delta) < 1 ? "up" : direction,
        atTop: currentY <= 0,
      });

      lastY = currentY > 0 ? currentY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}
