import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import Counter from "@/components/animation/Counter";
import { STATS } from "@/lib/data/site";

/**
 * "Sobre mí" section: a short, client-oriented intro plus animated counters.
 * No academic background is mentioned, by design.
 */
export default function About() {
  return (
    <section id="sobre-mi" className="scroll-mt-[70px] py-24 sm:py-28">
      <div className="container-page grid items-center gap-12 md:grid-cols-[auto,1fr] md:gap-16">
        {/* Photo placeholder (rounded square with initials) */}
        <AnimateOnScroll className="mx-auto md:mx-0">
          <div
            aria-hidden="true"
            className="flex h-44 w-44 items-center justify-center rounded-3xl bg-accent-soft text-5xl font-bold text-accent sm:h-56 sm:w-56 dark:bg-surface-secondary"
          >
            PE
          </div>
        </AnimateOnScroll>

        <div>
          <AnimateOnScroll>
            <p className="section-eyebrow">Sobre mí</p>
            <h2 className="mt-3 font-display text-h2-mobile font-bold text-content sm:text-h2">
              Experiencia real construyendo software que aguanta
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <div className="mt-6 space-y-4 text-lg text-content-muted">
              <p>
                Llevo 4,5 años desarrollando aplicaciones web en entornos
                exigentes, con empresas como <strong className="text-content">BBVA</strong> y{" "}
                <strong className="text-content">Dedalus</strong>. Hoy lidero como{" "}
                <strong className="text-content">Tech Lead</strong> un equipo de seis
                desarrolladores frontend.
              </p>
              <p>
                Esa experiencia se traduce en lo que de verdad te importa:
                webs rápidas, seguras y fáciles de mantener, pensadas para crecer
                con tu negocio en lugar de quedarse obsoletas en un año.
              </p>
              <p>
                Trabajo de forma directa, sin intermediarios, y me involucro en
                el proyecto desde la idea hasta el despliegue en producción.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Animated counters */}
          <dl className="mt-10 grid grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <AnimateOnScroll key={stat.label} delay={i * 100}>
                <div>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-4xl font-bold text-accent sm:text-5xl">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      delay={i * 200}
                    />
                  </dd>
                  <p className="mt-1 text-sm text-content-muted">{stat.label}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
