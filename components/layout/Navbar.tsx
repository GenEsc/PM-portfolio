"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-animated";
import useIconHover from "@/components/icons/useIconHover";
import { NAV_LINKS, SECTION_IDS, SITE } from "@/lib/data/site";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useActiveSection } from "@/hooks/useActiveSection";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Logo from "./Logo";

/**
 * Sticky navbar that:
 *  - is transparent on the hero (scrollY === 0)
 *  - hides on scroll-down, reappears immediately on scroll-up with a solid,
 *    blurred background and a subtle bottom border
 *  - highlights the link of the section currently in view
 *  - collapses into a hamburger menu on mobile
 */
export default function Navbar() {
  const { direction, atTop } = useScrollDirection();
  const activeId = useActiveSection(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuIcon = useIconHover();

  const hidden = direction === "down" && !atTop && !menuOpen;
  const solid = !atTop || menuOpen;

  return (
    <header
      data-testid="navbar"
      data-hidden={hidden}
      data-solid={solid}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
        solid
          ? "border-b border-line bg-surface/80 backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Principal"
        className="container-page flex h-[70px] items-center justify-between"
      >
        <a
          href="#inicio"
          className="flex items-center gap-2 text-content"
          aria-label={`${SITE.shortName} — inicio`}
        >
          <Logo className="h-8 w-8 text-accent" />
          <span className="font-display text-lg font-semibold">
            {SITE.shortName}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  data-active={isActive}
                  className={[
                    // Soft fade between active states (no instant swap).
                    "text-sm font-medium transition-colors duration-300 ease-out",
                    isActive
                      ? "text-accent"
                      : "text-content-muted hover:text-content",
                  ].join(" ")}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-content md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onMouseEnter={menuIcon.onMouseEnter}
            onMouseLeave={menuIcon.onMouseLeave}
          >
            {menuOpen ? (
              <XIcon
                ref={menuIcon.ref}
                size={20}
                animateOnHover={false}
                className="text-current"
              />
            ) : (
              <MenuIcon
                ref={menuIcon.ref}
                size={20}
                animateOnHover={false}
                className="text-current"
              />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-surface md:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "block py-3 text-base font-medium transition-colors",
                      isActive ? "text-accent" : "text-content",
                    ].join(" ")}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
