import { render, screen, act } from "@testing-library/react";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { getLastObserver } from "../../test-utils";

describe("AnimateOnScroll", () => {
  it("is hidden (pop-init) before entering the viewport", () => {
    render(
      <AnimateOnScroll>
        <p>content</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("content").parentElement!;
    expect(wrapper.classList.contains("pop-init")).toBe(true);
    expect(wrapper.classList.contains("pop-in")).toBe(false);
  });

  it("becomes visible (pop-in) once it enters the viewport", () => {
    render(
      <AnimateOnScroll>
        <p>content</p>
      </AnimateOnScroll>
    );
    act(() => getLastObserver().trigger(true));
    const wrapper = screen.getByText("content").parentElement!;
    expect(wrapper.classList.contains("pop-in")).toBe(true);
    expect(wrapper.classList.contains("pop-init")).toBe(false);
  });

  it("does NOT re-animate on scroll-up (stays visible)", () => {
    render(
      <AnimateOnScroll>
        <p>content</p>
      </AnimateOnScroll>
    );
    const observer = getLastObserver();
    act(() => observer.trigger(true)); // enters viewport
    act(() => observer.trigger(false)); // scroll back up — should be ignored

    const wrapper = screen.getByText("content").parentElement!;
    expect(wrapper.classList.contains("pop-in")).toBe(true);
    expect(wrapper.classList.contains("pop-init")).toBe(false);
  });
});
