"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Applies the theme class to <html> and persists the choice.
 * Initial value: localStorage if present, otherwise prefers-color-scheme.
 *
 * The very first paint is handled by an inline script in app/layout.tsx to
 * avoid a flash of the wrong theme (FOUC). This provider keeps React in sync.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Read whatever the inline script already resolved on <html>.
    const initial: Theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setThemeState(initial);
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors (e.g. private mode).
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme: applyTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

/**
 * Inline script string injected before hydration to set the initial theme
 * from localStorage / prefers-color-scheme and prevent a theme flash.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;
