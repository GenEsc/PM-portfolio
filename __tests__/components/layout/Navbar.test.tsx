import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { renderWithTheme, setScroll } from "../test-utils";

describe("Navbar", () => {
  beforeEach(() => {
    setScroll(0);
  });

  it("renders all navigation links", () => {
    renderWithTheme(<Navbar />);
    const nav = screen.getByRole("navigation", { name: "Principal" });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Inicio" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Sobre mí" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Contacto" }).length).toBeGreaterThan(0);
  });

  it("is visible at the top of the page", () => {
    renderWithTheme(<Navbar />);
    expect(screen.getByTestId("navbar")).toHaveAttribute("data-hidden", "false");
  });

  it("hides on scroll down and reappears on scroll up", async () => {
    renderWithTheme(<Navbar />);
    const navbar = screen.getByTestId("navbar");

    act(() => setScroll(300)); // scroll down
    await waitFor(() =>
      expect(navbar).toHaveAttribute("data-hidden", "true")
    );

    act(() => setScroll(150)); // scroll up
    await waitFor(() =>
      expect(navbar).toHaveAttribute("data-hidden", "false")
    );
  });

  it("becomes solid (blurred background) once scrolled away from the top", async () => {
    renderWithTheme(<Navbar />);
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toHaveAttribute("data-solid", "false");

    act(() => setScroll(120));
    await waitFor(() =>
      expect(navbar).toHaveAttribute("data-solid", "true")
    );
  });

  it("highlights the active section link", () => {
    renderWithTheme(<Navbar />);
    // With no sections in the DOM the first link (Inicio) is active by default.
    const inicioLinks = screen.getAllByRole("link", { name: "Inicio" });
    const desktopLink = inicioLinks.find(
      (link) => link.getAttribute("data-active") !== null
    );
    expect(desktopLink).toHaveAttribute("data-active", "true");
  });

  it("opens and closes the mobile menu", () => {
    renderWithTheme(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Abrir menú" });
    fireEvent.click(toggle);
    expect(
      screen.getByRole("button", { name: "Cerrar menú" })
    ).toBeInTheDocument();
  });
});
