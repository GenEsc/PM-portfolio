"use client";

import { type MouseEvent } from "react";
import type { BrandIcon } from "@/lib/data/stack";

/**
 * A single tech cell that tilts in 3D toward the cursor and emits a radial glow
 * from the exact cursor position (the glow tracks `--mx`/`--my`; styling lives in
 * `.magnet-cell` / `.ripple-bg` in globals.css). Pure event/CSS — no animation
 * loop. Respects `prefers-reduced-motion` (no tilt). See change-tech-stack-interactive.md.
 */
export default function MagnetCell({
  icon: Icon,
  name,
}: {
  icon: BrandIcon;
  name: string;
}) {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = ((y - rect.height / 2) / (rect.height / 2)) * 12;
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * -12;
    el.style.transform = `perspective(400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.06)`;
    el.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    el.style.setProperty("--my", `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <div
      className="magnet-cell"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="ripple-bg" aria-hidden="true" />
      <Icon size={36} className="relative z-[1]" />
      <span className="relative z-[1]">{name}</span>
    </div>
  );
}
