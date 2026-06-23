import { render, screen } from "@testing-library/react";
import Stack from "@/components/sections/Stack";
import { STACK } from "@/lib/data/stack";

describe("Stack", () => {
  it("renders the three group titles", () => {
    render(<Stack />);
    for (const group of STACK) {
      expect(
        screen.getByRole("heading", { name: group.title })
      ).toBeInTheDocument();
    }
  });

  it("renders every technology label", () => {
    render(<Stack />);
    for (const group of STACK) {
      for (const tech of group.items) {
        expect(screen.getByText(tech.name)).toBeInTheDocument();
      }
    }
  });

  it("renders 13 technologies in total", () => {
    render(<Stack />);
    const total = STACK.reduce((sum, group) => sum + group.items.length, 0);
    expect(total).toBe(13);
  });
});
