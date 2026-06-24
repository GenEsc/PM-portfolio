import { useRef } from "react";
import type { AnimatedIconHandle } from "@/components/icons/animated";

/**
 * Drives a lucide-animated icon from its PARENT's hover (the rule in
 * change-icon-parent-hover.md: the trigger lives on the nearest meaningful parent
 * — card, button, link — never on the icon itself). Spread the returned handlers
 * on the parent and attach `ref` to the icon, which should set
 * `animateOnHover={false}` so it only responds to the parent.
 *
 * Honors `prefers-reduced-motion` (no animation; the leave reset is harmless).
 */
export default function useIconHover() {
  const ref = useRef<AnimatedIconHandle>(null);

  const onMouseEnter = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    ref.current?.startAnimation();
  };

  const onMouseLeave = () => {
    ref.current?.stopAnimation();
  };

  return { ref, onMouseEnter, onMouseLeave };
}
