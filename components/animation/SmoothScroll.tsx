"use client";

import { useEffect } from "react";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { SCROLL_OFFSET } from "@/lib/site";

/**
 * Global handler that turns in-page anchor clicks (`<a href="#...">`) into a
 * JS momentum scroll, accounting for the sticky navbar height. Renders nothing.
 *
 * A single delegated listener covers every anchor on the page (navbar links,
 * hero CTAs, service CTAs, etc.) without each component needing its own handler.
 */
export default function SmoothScroll() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Let modified clicks (new tab, etc.) behave normally.
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const id = decodeURIComponent(href.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      smoothScrollTo(top);

      // Keep the URL hash in sync without triggering the native jump.
      history.pushState(null, "", href);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
