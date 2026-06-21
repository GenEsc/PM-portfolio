import { render, screen, act, waitFor } from "@testing-library/react";
import CareerTimeline from "@/components/sections/CareerTimeline";
import { MILESTONES } from "@/lib/data/timeline";
import { setScroll } from "../../test-utils";

describe("CareerTimeline", () => {
  it("renders the section heading", () => {
    render(<CareerTimeline />);
    expect(screen.getByText("Trayectoria")).toBeInTheDocument();
    expect(screen.getByText("El camino hasta aquí")).toBeInTheDocument();
  });

  it("renders every milestone company and role", () => {
    render(<CareerTimeline />);
    // Each milestone is rendered in both the desktop and mobile layouts.
    for (const m of MILESTONES) {
      expect(screen.getAllByText(m.company).length).toBeGreaterThan(0);
      expect(screen.getAllByText(m.role).length).toBeGreaterThan(0);
    }
  });

  it("initialises the drawable path with a normalised dash", () => {
    render(<CareerTimeline />);
    const path = screen.getByTestId("timeline-path");
    expect(path.style.strokeDasharray).toBe("1");
  });

  it("draws the path toward its target as the user scrolls", async () => {
    render(<CareerTimeline />);
    const path = screen.getByTestId("timeline-path");

    act(() => setScroll(800));
    // The offset lerps from 1 (undrawn) toward 0 (drawn) and snaps when close.
    await waitFor(
      () => expect(Number(path.style.strokeDashoffset)).toBeLessThan(1),
      { timeout: 3000 }
    );
  });
});
