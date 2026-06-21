import { render, waitFor } from "@testing-library/react";
import SmoothScroll from "@/components/animation/SmoothScroll";

describe("SmoothScroll", () => {
  beforeEach(() => {
    (window.scrollTo as jest.Mock).mockClear();
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  it("intercepts in-page anchor clicks and scrolls to the target section", async () => {
    const section = document.createElement("section");
    section.id = "contacto";
    document.body.appendChild(section);

    const link = document.createElement("a");
    link.setAttribute("href", "#contacto");
    document.body.appendChild(link);

    render(<SmoothScroll />);

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    // Default navigation is prevented and the JS scroll runs.
    expect(event.defaultPrevented).toBe(true);
    await waitFor(() => expect(window.scrollTo).toHaveBeenCalled());

    document.body.removeChild(section);
    document.body.removeChild(link);
  });

  it("ignores plain '#' links and external/hash-less anchors", () => {
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    document.body.appendChild(link);

    render(<SmoothScroll />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    document.body.removeChild(link);
  });
});
