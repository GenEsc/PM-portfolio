import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/lib/data/projects";

/**
 * "Proyectos" section: grid of project cards.
 *
 * For launch it shows the professional-experience cards. Personal demo projects
 * will be added later as "personal" entries in lib/data/projects.ts; the 2-col
 * grid already accommodates up to 4 cards. See docs/CONTRIBUTING.md.
 */
export default function Projects() {
  return (
    <section id="proyectos" className="scroll-mt-[70px] py-24 sm:py-28">
      <div className="container-page">
        <AnimateOnScroll>
          <p className="section-eyebrow">Proyectos</p>
          <h2 className="mt-3 font-display text-h2-mobile font-bold text-content sm:text-h2">
            Experiencia y proyectos
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-content-muted">
            Mi trayectoria en proyectos reales de primer nivel. Pronto sumaré
            aquí proyectos personales con demo y código.
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
