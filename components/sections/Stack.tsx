import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import StackMagneticGrid from "@/components/stack/StackMagneticGrid";
import TechSphere from "@/components/stack/TechSphere";

/**
 * Technology stack. Two device-specific experiences (see change-tech-stack-interactive.md):
 *  - desktop (≥768px): a magnetic grid of 3 categories, cells tilt toward the cursor;
 *  - mobile (<768px): a draggable 3D sphere of all logos with tap tooltips.
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

        <AnimateOnScroll delay={100}>
          <div className="mt-14">
            <StackMagneticGrid />
            <div className="md:hidden">
              <TechSphere />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
