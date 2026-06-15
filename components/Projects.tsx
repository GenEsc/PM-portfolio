import AnimateOnScroll from "./AnimateOnScroll";
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/lib/projects";

/**
 * "Proyectos" section: grid of project cards.
 * Content is placeholder for v1 — see lib/projects.ts to add real projects.
 */
export default function Projects() {
  return (
    <section id="proyectos" className="scroll-mt-[70px] py-24 sm:py-28">
      <div className="container-page">
        <AnimateOnScroll>
          <p className="section-eyebrow">Proyectos</p>
          <h2 className="mt-3 font-display text-h2-mobile font-bold text-content sm:text-h2">
            Trabajo seleccionado
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-content-muted">
            Una muestra de proyectos. Cada uno resuelve un problema concreto de
            negocio, no solo una demo técnica.
          </p>
        </AnimateOnScroll>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <AnimateOnScroll key={project.slug} delay={i * 50}>
              <ProjectCard project={project} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
