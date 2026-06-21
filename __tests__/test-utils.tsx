import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

/** Render a component wrapped in the ThemeProvider context. */
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

type MockIO = {
  trigger: (isIntersecting: boolean, ratio?: number) => void;
};

/** Returns the most recently constructed mock IntersectionObserver. */
export function getLastObserver(): MockIO {
  return (globalThis as unknown as Record<string, MockIO>)
    .__lastIntersectionObserver;
}

/** Set a fake vertical scroll position and emit a scroll event. */
export function setScroll(y: number) {
  Object.defineProperty(window, "scrollY", {
    value: y,
    writable: true,
    configurable: true,
  });
  window.dispatchEvent(new Event("scroll"));
}
