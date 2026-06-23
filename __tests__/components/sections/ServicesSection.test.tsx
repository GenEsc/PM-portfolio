import { render, screen } from "@testing-library/react";
import ServicesSection from "@/components/sections/ServicesSection";

describe("ServicesSection", () => {
  it("renders the three service cards", () => {
    render(<ServicesSection />);
    expect(
      screen.getByRole("heading", { name: "Desarrollo web desde cero" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Modernización de web existente" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "E-commerce" })
    ).toBeInTheDocument();
  });
});
