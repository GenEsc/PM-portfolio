import "@testing-library/jest-dom";

// jsdom does not implement IntersectionObserver — provide a controllable mock.
// Tests can grab the instance via (global as any).__lastIntersectionObserver
// to manually trigger entries.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    (globalThis as unknown as Record<string, unknown>).__lastIntersectionObserver =
      this;
  }

  observe = (el: Element) => {
    this.elements.add(el);
  };
  unobserve = (el: Element) => {
    this.elements.delete(el);
  };
  disconnect = () => {
    this.elements.clear();
  };
  takeRecords = (): IntersectionObserverEntry[] => [];

  /** Test helper: simulate an element entering the viewport. */
  trigger(isIntersecting: boolean, ratio = isIntersecting ? 1 : 0) {
    const entries = Array.from(this.elements).map(
      (target) =>
        ({
          target,
          isIntersecting,
          intersectionRatio: ratio,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: 0,
        }) as IntersectionObserverEntry
    );
    this.callback(entries, this);
  }
}

(globalThis as unknown as Record<string, unknown>).IntersectionObserver =
  MockIntersectionObserver;

// matchMedia is used by the theme init and hero parallax.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Stable requestAnimationFrame for counter/scroll animations in tests.
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb: FrameRequestCallback): number =>
    setTimeout(() => cb(performance.now()), 0) as unknown as number;
  global.cancelAnimationFrame = (id: number) => clearTimeout(id);
}
