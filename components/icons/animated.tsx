"use client";

/**
 * Animated UI icons (lucide-animated).
 *
 * lucide-animated ships its icons WITHOUT a "use client" directive even though
 * they rely on client-only hooks (motion's `useAnimation`, `useImperativeHandle`).
 * Re-exporting them from this "use client" module turns them into proper client
 * references, so Server Components (ServicesSection, Contact) can render them
 * without Next throwing. Client components (Navbar, ContactForm, ScrollStoryPath)
 * may import straight from "lucide-animated" instead.
 *
 * Colour comes from `currentColor` (the icons stroke with it), so tint them with
 * a text colour utility, e.g. `className="text-accent"`. By default each icon
 * animates on hover (`animateOnHover`); pass a ref and call `startAnimation()` to
 * drive it programmatically (used for the career-timeline node flashes).
 *
 * See change-animated-icons.md.
 */
export {
  TerminalIcon,
  RefreshCwIcon,
  CartIcon,
  AtSignIcon,
  GithubIcon,
  LinkedinIcon,
} from "lucide-animated";

import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";

/** Imperative handle exposed by every lucide-animated icon ref. */
export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

/**
 * A lucide-animated icon component: a currentColor SVG that animates on hover by
 * default, or — with a ref + `animateOnHover={false}` — is driven programmatically
 * via its handle. Used to type icons passed around as data/props.
 */
export type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & {
    size?: number;
    animateOnHover?: boolean;
  } & RefAttributes<AnimatedIconHandle>
>;
