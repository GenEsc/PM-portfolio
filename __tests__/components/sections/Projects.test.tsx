import { render, screen } from "@testing-library/react";
import Projects from "@/components/sections/Projects";
import { MILESTONES } from "@/lib/data/timeline";

describe("Projects", () => {
  it("renders the section heading", () => {
    render(<Projects />);
    expect(screen.getByText("Trayectoria y proyectos")).toBeInTheDocument();
  });

  it("lists the career milestones (accessible equivalent of the line nodes)", () => {
    render(<Projects />);
    for (const m of MILESTONES) {
      expect(
        screen.getByText(new RegExp(`${m.company}.*${m.year}`))
      ).toBeInTheDocument();
    }
  });
});
