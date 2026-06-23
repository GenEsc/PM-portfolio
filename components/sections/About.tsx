import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import Counter from "@/components/animation/Counter";
import CompanyTicker from "@/components/animation/CompanyTicker";
import { STATS } from "@/lib/data/site";

/**
 * "Sobre mí" section: a short, client-oriented intro plus animated counters.
 * No academic background is mentioned, by design.
 */
export default function About() {
  return (
    <section
      id="sobre-mi"
      className="relative z-10 scroll-mt-[70px] py-24 sm:py-28"
    >
      <div className="container-page max-w-3xl">
        <div>
          <AnimateOnScroll>
            <h2 className="font-display text-h2-mobile font-bold text-content sm:text-h2">
              Experiencia real construyendo software que aguanta
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <div className="mt-6 space-y-4 text-lg text-content-muted">
              <p>
                Llevo 5 años desarrollando aplicaciones web-app en entornos
                empresas líderes en su sector, con empresas como{" "}
                <CompanyTicker />. Hoy lidero como{" "}
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
