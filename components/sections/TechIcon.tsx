"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ComponentType } from "react";

/** Hover animation styles, picked per technology in lib/data/stack.tsx. */
export type TechAnimation = "spin" | "bounce" | "pulse" | "shake";

/** developer-icons components: coloured brand SVGs sized via a `size` prop. */
export type BrandIcon = ComponentType<{ size?: number; className?: string }>;

// One Motion variant set per animation. `rest` is the idle state; `hover` is
// propagated down from the parent box on hover (see the box's whileHover).
const VARIANTS: Record<TechAnimation, Variants> = {
  // Spin — for React (atomic shape) and Angular (rotational logo).
  spin: {
    rest: { rotate: 0 },
    hover: { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } },
  },
  // Bounce — for general/foundational tech (HTML, Java, Docker, databases…).
  bounce: {
    rest: { y: 0 },
    hover: { y: -6, transition: { type: "spring", stiffness: 400, damping: 10 } },
  },
  // Pulse scale — for cloud icons (AWS, Azure) and TypeScript: subtle, pro.
  pulse: {
    rest: { scale: 1 },
    hover: { scale: 1.15, transition: { type: "spring", stiffness: 300, damping: 12 } },
  },
  // Shake — for Git: version control feels energetic.
  shake: {
    rest: { x: 0 },
    hover: {
      x: [0, -4, 4, -4, 4, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  },
};

/**
 * A single tech-stack entry: a coloured brand logo in a neutral tile that
 * animates on hover, with its name beside it. The hover state lives on the tile
 * and Motion propagates it to the inner icon, so the whole row is the target.
 * Respects `prefers-reduced-motion`.
 */
export default function TechIcon({
  icon: Icon,
  name,
  animation,
}: {
  icon: BrandIcon;
  name: string;
  animation: TechAnimation;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <li className="flex items-center gap-3 text-content" aria-label={name}>
      <motion.span
        initial="rest"
        animate="rest"
        whileHover={reduceMotion ? undefined : "hover"}
        className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-secondary"
      >
        <motion.span
          variants={reduceMotion ? undefined : VARIANTS[animation]}
          className="flex items-center justify-center"
        >
          <Icon size={26} aria-hidden="true" />
        </motion.span>
      </motion.span>
      <span className="font-mono text-sm">{name}</span>
    </li>
  );
}
