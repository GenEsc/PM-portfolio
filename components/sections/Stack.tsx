import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import TechIcon from "@/components/sections/TechIcon";
import { STACK } from "@/lib/data/stack";

/**
 * Technology stack, grouped in three columns (Frontend / Backend / DevOps).
 * Icons + names only — no proficiency bars, by design. Each logo animates on
 * hover (see TechIcon).
 */
export default function Stack() {
  return (
    <section
      id="stack"
      className="relative z-10 scroll-mt-[70px] py-24 sm:py-28"
    >
      <div className="container-page">
        <AnimateOnScroll>
          <h2 className="font-display text-h2-mobile font-bold text-content sm:text-h2">
            Las herramientas con las que trabajo
          </h2>
        </AnimateOnScroll>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STACK.map((group, groupIndex) => (
            <AnimateOnScroll key={group.title} delay={groupIndex * 50}>
              <div>
                <h3 className="font-display text-h3 font-semibold text-content">
                  {group.title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {group.items.map((tech) => (
                    <TechIcon
                      key={tech.name}
                      icon={tech.icon}
                      name={tech.name}
                      animation={tech.animation}
                    />
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
