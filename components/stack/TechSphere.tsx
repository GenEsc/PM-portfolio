"use client";

import { useEffect, useRef } from "react";
import { ALL_TECHS } from "@/lib/data/stack";

const ID_REF_ATTRS = ["fill", "stroke", "clip-path", "mask", "filter"];

/**
 * developer-icons hard-code internal ids (e.g. Azure's gradients: id="azure__a").
 * The desktop grid renders the same icons, so those ids are duplicated in the
 * document; when the grid is display:none, the sphere's `fill="url(#…)"` resolves
 * to the hidden copy and breaks (Azure rendered wrong). Scope every id in the
 * sphere's SVGs to its instance so its gradient refs stay self-contained.
 */
function scopeIconIds(root: HTMLElement) {
  root.querySelectorAll("svg").forEach((svg, idx) => {
    svg.querySelectorAll<SVGElement>("[id]").forEach((el) => {
      const oldId = el.id;
      const newId = `${oldId}__sphere${idx}`;
      el.id = newId;
      const ref = `url(#${oldId})`;
      const nref = `url(#${newId})`;
      svg.querySelectorAll<SVGElement>("*").forEach((node) => {
        for (const attr of ID_REF_ATTRS) {
          const v = node.getAttribute(attr);
          if (v?.includes(ref)) node.setAttribute(attr, v.replace(ref, nref));
        }
        for (const attr of ["href", "xlink:href"]) {
          if (node.getAttribute(attr) === `#${oldId}`) {
            node.setAttribute(attr, `#${newId}`);
          }
        }
      });
    });
  });
}

/**
 * Mobile tech stack: all logos orbit in a 3D sphere (Fibonacci distribution) that
 * auto-rotates and can be dragged; tapping an icon shows a name·category tooltip.
 *
 * The rAF loop only runs while the sphere is on screen (IntersectionObserver) →
 * zero CPU when scrolled away. Honors `prefers-reduced-motion` (static, no loop).
 * The orbiting icons are decorative (aria-hidden); an sr-only list carries the
 * accessible names. See change-tech-stack-interactive.md.
 */
export default function TechSphere() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tooltip = tooltipRef.current;
    if (!wrap || !tooltip) return;

    const icons = iconRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null
    );
    const count = icons.length;
    if (count === 0) return;

    // Fibonacci-sphere angles → icons spread evenly over the surface. The `+0.5`
    // offset keeps the first/last icons OFF the exact poles: a point at a pole has
    // sin(phi)=0, so it wouldn't move under the y-axis auto-rotation (that was why
    // the first icon sat frozen at the bottom). `theta` uses the golden angle.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const positions = Array.from({ length: count }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = golden * i;
      return { phi, theta };
    });

    scopeIconIds(wrap);

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rotY = 0;
    let rotX = 0.4; // gentle downward tilt so it reads as a sphere, not a ring
    let raf = 0;
    let isVisible = false;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let baseRotY = 0;
    let baseRotX = 0;
    let tooltipTimer = 0;

    const place = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const radius = Math.min(w, h) * 0.38;
      const cx = w / 2;
      const cy = h / 2;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      for (let i = 0; i < count; i++) {
        const { phi, theta } = positions[i];
        const a = theta + rotY;
        const sinPhi = Math.sin(phi);
        const x = sinPhi * Math.cos(a);
        const y = sinPhi * Math.sin(a) * sinX + Math.cos(phi) * cosX;
        const z = sinPhi * Math.sin(a) * cosX - Math.cos(phi) * sinX;
        const depth = (z + 1.5) / 2.5; // 0 (back) … 1 (front)
        const el = icons[i];
        el.style.left = `${cx + x * radius}px`;
        el.style.top = `${cy - y * radius}px`;
        el.style.opacity = `${depth * 0.85 + 0.15}`;
        el.style.transform = `translate(-50%, -50%) scale(${depth * 0.6 + 0.45})`;
        el.style.zIndex = `${Math.round(z * 10 + 20)}`;
      }
    };

    const render = () => {
      if (!isVisible) {
        raf = 0;
        return;
      }
      if (!dragging && !reduceMotion) rotY += 0.008;
      place();
      if (reduceMotion) {
        raf = 0; // static layout, no ongoing loop
        return;
      }
      raf = window.requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!raf && isVisible) raf = window.requestAnimationFrame(render);
    };

    // Drag to spin (pointer events cover touch + mouse; touch-action:none on the
    // wrap stops the gesture from scrolling the page).
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      baseRotY = rotY;
      baseRotX = rotX;
      wrap.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      rotY = baseRotY + dx * 0.012;
      rotX = baseRotX + dy * 0.012;
      if (reduceMotion) place(); // no loop running → reposition on demand
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      wrap.releasePointerCapture?.(e.pointerId);
    };

    const hideTooltip = () => {
      tooltip.style.opacity = "0";
      tooltip.style.transform = "translateX(-50%) translateY(4px)";
    };
    const onClick = (e: MouseEvent) => {
      if (moved) return; // it was a drag, not a tap
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        ".sphere-icon"
      );
      if (!target) {
        hideTooltip();
        return;
      }
      tooltip.textContent = `${target.dataset.name ?? ""} · ${target.dataset.category ?? ""}`;
      tooltip.style.opacity = "1";
      tooltip.style.transform = "translateX(-50%) translateY(0)";
      window.clearTimeout(tooltipTimer);
      tooltipTimer = window.setTimeout(hideTooltip, 2000);
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointercancel", onPointerUp);
    wrap.addEventListener("click", onClick);

    place(); // initial layout (also the final state under reduced motion)

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startLoop();
      },
      { threshold: 0.1 }
    );
    observer.observe(wrap);

    return () => {
      observer.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      window.clearTimeout(tooltipTimer);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
      wrap.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      {/* Accessible names (the orbiting sphere itself is decorative). */}
      <ul className="sr-only">
        {ALL_TECHS.map((tech) => (
          <li key={tech.name}>
            {tech.name} · {tech.category}
          </li>
        ))}
      </ul>

      <div
        ref={wrapRef}
        aria-hidden="true"
        className="relative mx-auto h-[340px] w-full max-w-[380px] touch-none select-none"
      >
        {ALL_TECHS.map((tech, i) => {
          const Icon = tech.icon;
          return (
            <span
              key={tech.name}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              data-name={tech.name}
              data-category={tech.category}
              className="sphere-icon absolute left-1/2 top-1/2 block will-change-transform"
            >
              <Icon size={34} />
            </span>
          );
        })}
        <div ref={tooltipRef} className="sphere-tooltip" />
      </div>
    </>
  );
}
