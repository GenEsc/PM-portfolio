import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { MILESTONES } from "@/lib/data/timeline";

/**
 * "Proyectos" section: the career trajectory.
 *
 * The three milestones (Dedalus → BBVA → Verti) are rendered as dot+label nodes
 * sitting on the full-page storyline (ScrollStoryPath), which samples this
 * section's track to place them on the line. The visible nodes are decorative
 * (aria-hidden in the overlay), so the `sr-only` ordered list below is the
 * accessible equivalent and keeps the milestones in the correct reading order.
 *
 * The track reserves the vertical space the floating nodes occupy. Personal
 * demo projects will be added later as their own cards. See docs/CONTRIBUTING.md.
 */
export default function Projects() {
  return (
    <section
      id="proyectos"
      className="relative z-10 scroll-mt-[70px] py-24 sm:py-28"
    >
      <div className="container-page">
        <AnimateOnScroll>
          <h2 className="font-display text-h2-mobile font-bold text-content sm:text-h2">
            Trayectoria y proyectos
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-content-muted">
            El camino que me ha traído hasta aquí, etapa a etapa, hasta liderar
            hoy un equipo como Tech Lead. Pronto sumaré proyectos personales con
            demo y código.
          </p>
        </AnimateOnScroll>

        {/* Reserves the vertical space for the milestone nodes that float on the
            storyline (rendered by ScrollStoryPath). The list is the accessible
            equivalent of those visual nodes. */}
        <div
          id="trayectoria-track"
          className="relative mt-10 min-h-[900px] sm:min-h-[1040px]"
        >
          <ol className="sr-only">
            {MILESTONES.map((m) => (
              <li key={m.company}>
                {m.company} · {m.year} — {m.role}. {m.summary}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
