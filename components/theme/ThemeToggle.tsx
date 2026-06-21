"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";

/**
 * Sun/moon button that toggles light/dark mode.
 * The choice is persisted to localStorage by the ThemeProvider.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={isDark}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-content transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {isDark ? (
        <FiSun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <FiMoon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
