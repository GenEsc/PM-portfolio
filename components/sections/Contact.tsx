import {
  AtSignIcon,
  GithubIcon,
  LinkedinIcon,
} from "@/components/icons/animated";
import HoverIconLink from "@/components/icons/HoverIconLink";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import ContactForm from "./ContactForm";
import { SITE } from "@/lib/data/site";

/**
 * "Contacto" section: heading, form, visible email and social links.
 *
 * This is where the career storyline "arrives". The section's background is the
 * SAME as the page until the scroll path reaches it (no intermediate tint), then
 * ScrollStoryPath adds `.is-confluent` and animates the `--contact-fill` custom
 * property so the green pours in from the top down to the bottom, finishing with
 * `.is-confluent-complete` (solid). Text/form colours flip to white via the
 * `.is-confluent` rules in globals.css — all a permanent, CSS-driven state.
 */
export default function Contact() {
  return (
    <section
      id="contacto"
      className="relative z-10 scroll-mt-[70px] overflow-hidden py-24 sm:py-28"
    >
      <div className="container-page relative z-10 grid gap-12 md:grid-cols-2 md:gap-16">
        <AnimateOnScroll>
          <h2 className="font-display text-h2-mobile font-bold text-content sm:text-h2">
            ¿Tienes un proyecto en mente? Hablemos.
          </h2>
          <p className="mt-4 text-lg text-content-muted">
            Cuéntame qué necesitas y te responderé con los siguientes pasos.
          </p>

          <div className="mt-8 space-y-3">
            <HoverIconLink
              href={`mailto:${SITE.email}`}
              icon={AtSignIcon}
              iconClassName="text-current"
              className="inline-flex items-center gap-3 text-content transition-colors hover:text-accent"
            >
              {SITE.email}
            </HoverIconLink>
            <div className="flex gap-4 pt-2">
              <HoverIconLink
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="LinkedIn"
                icon={LinkedinIcon}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-content transition-colors hover:border-accent hover:text-accent"
              />
              <HoverIconLink
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="GitHub"
                icon={GithubIcon}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-content transition-colors hover:border-accent hover:text-accent"
              />
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <ContactForm />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
