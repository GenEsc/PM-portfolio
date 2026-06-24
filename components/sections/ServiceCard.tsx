"use client";

import useIconHover from "@/components/icons/useIconHover";
import type { AnimatedIcon } from "@/components/icons/animated";

/**
 * A service card whose lucide-animated icon animates when the whole card is
 * hovered — the trigger lives on the card, not the icon (see
 * change-icon-parent-hover.md).
 */
export default function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: AnimatedIcon;
  title: string;
  description: string;
}) {
  const { ref, onMouseEnter, onMouseLeave } = useIconHover();

  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent dark:bg-surface-secondary">
        <Icon ref={ref} size={24} animateOnHover={false} className="text-accent" />
      </span>
      <h3 className="mt-5 font-display text-h3 font-semibold text-content">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-content-muted">{description}</p>
    </div>
  );
}
