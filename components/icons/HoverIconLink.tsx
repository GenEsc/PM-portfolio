"use client";

import type { ReactNode } from "react";
import useIconHover from "@/components/icons/useIconHover";
import type { AnimatedIcon } from "@/components/icons/animated";

/**
 * A link whose lucide-animated icon animates when the WHOLE link is hovered (not
 * just the icon). The hover trigger lives on the `<a>`; the icon is driven via its
 * ref with `animateOnHover` off (see change-icon-parent-hover.md). Optional
 * children render after the icon (e.g. an email address beside the @ mark).
 */
export default function HoverIconLink({
  href,
  icon: Icon,
  iconSize = 20,
  iconClassName,
  ariaLabel,
  className,
  target,
  rel,
  children,
}: {
  href: string;
  icon: AnimatedIcon;
  iconSize?: number;
  iconClassName?: string;
  ariaLabel?: string;
  className?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
}) {
  const { ref, onMouseEnter, onMouseLeave } = useIconHover();

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Icon
        ref={ref}
        size={iconSize}
        animateOnHover={false}
        aria-hidden="true"
        className={iconClassName}
      />
      {children}
    </a>
  );
}
