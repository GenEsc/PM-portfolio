import { screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { renderWithTheme } from "../../test-utils";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders a toggle button", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles from light to dark and back", () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole("button");

    // Starts in light mode.
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists the choice in localStorage", () => {
    renderWithTheme(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(localStorage.getItem("theme")).toBe("dark");

    fireEvent.click(screen.getByRole("button"));
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
