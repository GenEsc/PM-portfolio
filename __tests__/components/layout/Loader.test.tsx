import { act, render, screen } from "@testing-library/react";
import Loader from "@/components/layout/Loader";

describe("Loader", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    sessionStorage.clear();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("shows the spinning logo and locks scroll on the first visit", () => {
    render(<Loader />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    // The brand mark is rendered with an accessible "Cargando" label.
    expect(screen.getByLabelText("Cargando")).toBeInTheDocument();
    // Scrolling is disabled while the overlay is up.
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("slides away, restores scroll and remembers it for the session", () => {
    render(<Loader />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Min display + finishing the spin cycle + slide-up are all timer driven.
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(sessionStorage.getItem("hasSeenLoader")).toBe("true");
  });

  it("skips the overlay entirely on a repeat visit in the same session", () => {
    sessionStorage.setItem("hasSeenLoader", "true");

    render(<Loader />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    // Never locks scrolling when it does not show.
    expect(document.body.style.overflow).toBe("");
  });
});
