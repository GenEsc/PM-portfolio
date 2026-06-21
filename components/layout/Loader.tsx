"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

/** sessionStorage key — loader plays once per browser session (see change req). */
const STORAGE_KEY = "hasSeenLoader";

/** Minimum time the loader stays on screen, even on a fast connection. */
const MIN_DISPLAY_MS = 1000;
/** Spin animation period — must match `loaderSpin` in globals.css. */
const SPIN_PERIOD_MS = 1200;
/** Slide-up exit duration — must match `.loader` transition in globals.css. */
const SLIDE_MS = 700;
/** Fade-out duration used when the user prefers reduced motion. */
const FADE_MS = 320;

/**
 * Full-screen loading overlay shown on the first paint of a session.
 *
 * A spinning brand mark sits over a theme-matched background (via the `--bg`
 * CSS variable, so it never flashes the wrong theme). Once page assets are
 * ready *and* a minimum of {@link MIN_DISPLAY_MS} has elapsed, the logo finishes
 * its current rotation, then the whole overlay slides up to reveal the page.
 *
 * It plays at most once per session: {@link STORAGE_KEY} in `sessionStorage`
 * gates it. The companion {@link loaderInitScript} hides the overlay before
 * paint on repeat visits so there is no flash.
 */
export default function Loader() {
  // Rendered server-side and on the first client render so the overlay exists
  // before hydration. The effect below removes it immediately if already seen.
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // sessionStorage unavailable (e.g. privacy mode): treat as first visit.
    }

    if (seen) {
      setVisible(false);
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Lock scrolling while the overlay is up.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let assetsReady = document.readyState === "complete";
    let minElapsed = false;
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cleanupOverlay = () => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
      try {
        sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // Ignore storage errors — the overlay still exits this session.
      }
    };

    const startExit = () => {
      setExiting(true);
      timers.push(setTimeout(cleanupOverlay, reducedMotion ? FADE_MS : SLIDE_MS));
    };

    const finish = () => {
      if (done) return;
      done = true;
      // Let the logo complete its current rotation so it never cuts mid-spin.
      // (No spin under reduced motion, so exit straight away.)
      let untilCycleEnd = 0;
      if (!reducedMotion) {
        const remainder = (performance.now() - start) % SPIN_PERIOD_MS;
        untilCycleEnd = remainder === 0 ? 0 : SPIN_PERIOD_MS - remainder;
      }
      timers.push(setTimeout(startExit, untilCycleEnd));
    };

    const tryFinish = () => {
      if (assetsReady && minElapsed) finish();
    };

    timers.push(
      setTimeout(() => {
        minElapsed = true;
        tryFinish();
      }, MIN_DISPLAY_MS)
    );

    const onLoad = () => {
      assetsReady = true;
      tryFinish();
    };
    if (!assetsReady) window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      timers.forEach(clearTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`loader${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
    >
      <Logo className="loader__logo" title="Cargando" />
    </div>
  );
}

/**
 * Inline script injected before paint (see `app/layout.tsx`). On a repeat visit
 * within the same session it adds `loader-seen` to <html> so CSS can hide the
 * overlay synchronously — preventing a one-frame flash before React mounts.
 */
export const loaderInitScript = `
(function () {
  try {
    if (sessionStorage.getItem('${STORAGE_KEY}') === 'true') {
      document.documentElement.classList.add('loader-seen');
    }
  } catch (e) {}
})();
`;
