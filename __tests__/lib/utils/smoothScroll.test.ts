import { waitFor } from "@testing-library/react";
import { smoothScrollTo, scrollDurationFor } from "@/lib/utils/smoothScroll";

describe("scrollDurationFor", () => {
  it("scales with distance and clamps between 500ms and 1200ms", () => {
    expect(scrollDurationFor(0)).toBe(500); // floor
    expect(scrollDurationFor(3000)).toBe(1000); // 3000 / 3
    expect(scrollDurationFor(100000)).toBe(1200); // ceiling
    expect(scrollDurationFor(-9000)).toBe(1200); // uses absolute distance
  });
});

describe("smoothScrollTo", () => {
  beforeEach(() => {
    (window.scrollTo as jest.Mock).mockClear();
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  it("animates the window scroll and lands on the target", async () => {
    smoothScrollTo(600, 60);
    await waitFor(() => {
      const calls = (window.scrollTo as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const lastY = calls[calls.length - 1][1];
      expect(lastY).toBeCloseTo(600, 0);
    });
  });
});
