"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Primary CTA with a radial flood on hover: a dark-green circle expands from the
 * exact cursor position, flooding the button, and contracts back on leave. The
 * label stays above the flood (z-10) and white throughout.
 *
 * Polymorphic — renders an `<a>` when `href` is given, otherwise a `<button>`.
 * Keeps the shared `.btn-primary` look (pill, tokens); only adds the flood layer.
 * Honors `prefers-reduced-motion` (no ripple — the base hover colour stands in).
 */
type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function PrimaryButton({
  children,
  className = "",
  href,
  target,
  rel,
  type = "button",
  disabled,
  onClick,
  ...rest
}: Props) {
  const rippleRef = useRef<HTMLSpanElement>(null);

  const handleEnter = (e: MouseEvent<HTMLElement>) => {
    const ripple = rippleRef.current;
    if (!ripple || prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transition = "none";
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    ripple.style.opacity = "1";
    void ripple.offsetWidth; // force reflow so the grow transition fires
    ripple.style.transition =
      "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
    ripple.style.transform = "translate(-50%, -50%) scale(40)";
  };

  const handleLeave = () => {
    const ripple = rippleRef.current;
    if (!ripple) return;
    ripple.style.transition =
      "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    ripple.style.opacity = "0";
  };

  const classes = `btn-primary relative overflow-hidden ${className}`.trim();

  const inner = (
    <>
      <span
        ref={rippleRef}
        aria-hidden="true"
        className="pointer-events-none absolute block h-3 w-3 rounded-full opacity-0"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) scale(0)",
          background: "var(--accent-deep)",
        }}
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={onClick}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      {...rest}
    >
      {inner}
    </button>
  );
}
