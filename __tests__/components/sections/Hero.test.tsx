import { render, screen } from "@testing-library/react";
import Hero from "@/components/sections/Hero";
import { SITE } from "@/lib/data/site";

describe("Hero", () => {
  it("renders the name as the main heading", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: SITE.name })
    ).toBeInTheDocument();
  });

  it("renders the tagline / value proposition", () => {
    render(<Hero />);
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
  });

  it("renders the availability badge", () => {
    render(<Hero />);
    expect(screen.getByText(SITE.availability)).toBeInTheDocument();
  });

  it("renders the primary and secondary CTAs with correct anchors", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: "Hablemos" });
    const secondary = screen.getByRole("link", { name: "Ver proyectos" });
    expect(primary).toHaveAttribute("href", "#contacto");
    expect(secondary).toHaveAttribute("href", "#proyectos");
  });
});
