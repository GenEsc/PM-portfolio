import { render, screen, act } from "@testing-library/react";
import ScrollStoryPath from "@/components/animation/ScrollStoryPath";
import { MILESTONES } from "@/lib/data/timeline";
import { setScroll } from "../../test-utils";

/** Let queued rAFs (measure + the reveal lerp) run for a while. The reveal is
 *  velocity-capped, so allow enough frames for it to advance noticeably. */
const flush = (ms = 160) =>
  act(async () => {
    await new Promise((r) => setTimeout(r, ms));
  });

/** Render the path between stand-in #sobre-mi / #contacto anchors. */
function renderWithAnchors() {
  return render(
    <>
      <div id="sobre-mi" />
      <ScrollStoryPath />
      <div id="contacto" />
    </>
  );
}

describe("ScrollStoryPath", () => {
  it("renders the weave line and the convergence funnel", () => {
    renderWithAnchors();
    expect(screen.getByTestId("story-path")).toBeInTheDocument();
    expect(screen.getByTestId("story-funnel")).toBeInTheDocument();
  });

  it("renders a dot+label node for each milestone", () => {
    renderWithAnchors();
    MILESTONES.forEach((m, i) => {
      expect(screen.getByTestId(`story-node-${i}`)).toBeInTheDocument();
      expect(screen.getByText(m.role)).toBeInTheDocument();
    });
  });

  it("renders the spinning logo origin with its start badge", () => {
    renderWithAnchors();
    expect(screen.getByText(/Inicio/)).toBeInTheDocument();
  });

  it("renders the travelling particle and the idle energy segment", () => {
    renderWithAnchors();
    expect(screen.getByTestId("story-particle")).toBeInTheDocument();
    expect(screen.getByTestId("story-pulse")).toBeInTheDocument();
  });

  it("reveals the line (clip height) as the user scrolls into range", async () => {
    renderWithAnchors();
    const rect = screen.getByTestId("story-reveal");
    const height = () => Number(rect.getAttribute("height"));

    // Realistic span well below the initial viewport.
    const start = document.getElementById("sobre-mi")!;
    const end = document.getElementById("contacto")!;
    start.getBoundingClientRect = () => ({ top: 3000 }) as DOMRect;
    end.getBoundingClientRect = () => ({ top: 6000 }) as DOMRect;

    // Near the top the line is essentially unrevealed (clip height ≈ 0).
    await act(async () => {
      setScroll(0);
      window.dispatchEvent(new Event("resize"));
    });
    await flush();
    expect(height()).toBeLessThan(50);

    // Scrolling down reveals it (clip height grows; the draw is velocity-capped
    // so it advances steadily rather than snapping).
    await act(async () => setScroll(4500));
    await flush(800);
    expect(height()).toBeGreaterThan(100);
  });
});
