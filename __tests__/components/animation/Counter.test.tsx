import { render, screen, act, waitFor } from "@testing-library/react";
import Counter from "@/components/animation/Counter";
import { getLastObserver } from "../../test-utils";

describe("Counter", () => {
  it("starts at 0 before entering the viewport", () => {
    render(<Counter value={4} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("animates up to the target value and stops there", async () => {
    render(<Counter value={4} duration={60} delay={0} />);
    act(() => getLastObserver().trigger(true));

    await waitFor(() => expect(screen.getByText("4")).toBeInTheDocument());

    // Give the animation loop time to settle, then confirm it stays at 4.
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders an optional suffix", async () => {
    render(<Counter value={2} suffix="+" duration={40} delay={0} />);
    act(() => getLastObserver().trigger(true));
    await waitFor(() => expect(screen.getByText("2+")).toBeInTheDocument());
  });
});
