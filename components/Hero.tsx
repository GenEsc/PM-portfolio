"use client";

import { useEffect, useRef } from "react";
import { FaReact, FaAngular, FaJs, FaDocker } from "react-icons/fa6";
import { SiSpringboot, SiTypescript } from "react-icons/si";
import { SITE } from "@/lib/site";

/**
 * Hero section.
 *
 * Contains the name, value proposition, an animated availability badge and the
 * two CTAs. Decorative circles and floating tech icons react to the cursor
 * with a subtle, layered parallax (opposite to the cursor → depth). The effect
 * is hero-only and disabled on touch devices.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Disable parallax on touch / no fine pointer.
    const finePointer = globalThis.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const layers = Array.from(
      section.querySelectorAll<HTMLElement>("[data-parallax]")
    );

    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      for (const layer of layers) {
        const factor = Number(layer.dataset.parallax ?? "0");
        // Move opposite to the cursor for a depth effect.
        layer.style.transform = `translate(${-dx * factor}px, ${-dy * factor}px)`;
      }
    };

    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[70px]"
    >
      {/* Decorative parallax layers (behind the text) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span
          data-parallax="0.02"
          className="absolute left-[8%] top-[20%] block h-72 w-72 rounded-full bg-accent/10 blur-2xl transition-transform duration-150 ease-out"
        />
        <span
          data-parallax="0.02"
          className="absolute right-[6%] bottom-[14%] block h-80 w-80 rounded-full bg-accent/10 blur-2xl transition-transform duration-150 ease-out"
        />
        <span
          data-parallax="0.035"
          className="absolute right-[22%] top-[24%] block h-24 w-24 rounded-full bg-accent/20 blur-md transition-transform duration-150 ease-out"
        />
        <span
          data-parallax="0.035"
          className="absolute left-[18%] bottom-[22%] block h-16 w-16 rounded-full bg-accent/20 blur-md transition-transform duration-150 ease-out"
        />

        {/* Floating tech icons */}
        <FaReact
          data-parallax="0.045"
          className="absolute left-[12%] top-[34%] hidden h-10 w-10 text-accent/40 transition-transform duration-150 ease-out md:block"
        />
        <SiTypescript
          data-parallax="0.045"
          className="absolute right-[14%] top-[30%] hidden h-9 w-9 text-accent/40 transition-transform duration-150 ease-out md:block"
        />
        <SiSpringboot
          data-parallax="0.045"
          className="absolute right-[28%] bottom-[24%] hidden h-9 w-9 text-accent/40 transition-transform duration-150 ease-out md:block"
        />
        <FaAngular
          data-parallax="0.045"
          className="absolute left-[26%] top-[18%] hidden h-9 w-9 text-accent/40 transition-transform duration-150 ease-out md:block"
        />
        <FaJs
          data-parallax="0.045"
          className="absolute left-[20%] bottom-[28%] hidden h-8 w-8 text-accent/40 transition-transform duration-150 ease-out md:block"
        />
        <FaDocker
          data-parallax="0.045"
          className="absolute right-[18%] bottom-[34%] hidden h-9 w-9 text-accent/40 transition-transform duration-150 ease-out md:block"
        />
      </div>

      <div className="container-page relative">
        <div className="max-w-3xl">
          {/* Availability badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-secondary px-4 py-1.5 text-sm font-medium text-content">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            {SITE.availability}
          </span>

          <h1 className="font-display text-h1-mobile font-bold tracking-tight text-content lg:text-h1">
            {SITE.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-content-muted sm:text-xl">
            {SITE.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contacto" className="btn-primary">
              Hablemos
            </a>
            <a href="#proyectos" className="btn-secondary">
              Ver proyectos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
