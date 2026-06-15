import { render, screen, act, waitFor } from "@testing-library/react";
import ScrollPath from "@/components/ScrollPath";
import { setScroll } from "../test-utils";

// jsdom does not implement SVG geometry — provide a fixed path length.
beforeAll(() => {
  (
    SVGElement.prototype as unknown as { getTotalLength: () => number }
  ).getTotalLength = () => 1000;
});

function setDocHeights(scrollHeight: number, clientHeight: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, "clientHeight", {
    value: clientHeight,
    configurable: true,
  });
}

describe("ScrollPath", () => {
  it("renders the SVG path in the DOM", () => {
    render(<ScrollPath />);
    expect(screen.getByTestId("scroll-path")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-path-line")).toBeInTheDocument();
  });

  it("initialises stroke-dasharray to the path length", () => {
    render(<ScrollPath />);
    const path = screen.getByTestId("scroll-path-line");
    expect(path.style.strokeDasharray).toBe("1000");
  });

  it("updates stroke-dashoffset as the user scrolls", async () => {
    setDocHeights(2000, 1000); // scrollable range = 1000
    render(<ScrollPath />);
    const path = screen.getByTestId("scroll-path-line");

    act(() => setScroll(0));
    await waitFor(() => expect(path.style.strokeDashoffset).toBe("1000"));

    act(() => setScroll(500)); // 50% scrolled
    await waitFor(() => expect(path.style.strokeDashoffset).toBe("500"));
  });
});
