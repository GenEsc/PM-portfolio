import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import ContactForm from "./ContactForm";
import { SITE } from "@/lib/data/site";

/**
 * "Contacto" section: heading, form, visible email and social links.
 *
 * This is where the career storyline "arrives". The section starts NEUTRAL; when
 * the scroll path reaches it, ScrollStoryPath adds `.is-confluent`, which fades
 * in the green overlay below and flips all the text/form to white — a permanent
 * "confluence" (see change-storyline-animations-fix.md and the `.is-confluent`
 * rules in globals.css). The colour change is CSS-driven off that one class.
 */
export default function Contact() {
  return (
    <section
      id="contacto"
      className="relative z-10 scroll-mt-[70px] overflow-hidden bg-surface-secondary py-24 sm:py-28"
    >
      {/* Confluence flood: emerald overlay, hidden until `.is-confluent`. */}
      <div
        id="contact-glow-overlay"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent to-accent-hover"
      />

      <div className="container-page relative z-10 grid gap-12 md:grid-cols-2 md:gap-16">
        <AnimateOnScroll>
          <h2 className="font-display text-h2-mobile font-bold text-content sm:text-h2">
            ¿Tienes un proyecto en mente? Hablemos.
          </h2>
          <p className="mt-4 text-lg text-content-muted">
            Cuéntame qué necesitas y te responderé con los siguientes pasos.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-3 text-content transition-colors hover:text-accent"
            >
              <Mail aria-hidden="true" className="h-5 w-5" />
              {SITE.email}
            </a>
            <div className="flex gap-4 pt-2">
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-content transition-colors hover:border-accent hover:text-accent"
              >
                <LinkedinIcon aria-hidden="true" className="h-5 w-5" />
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-content transition-colors hover:border-accent hover:text-accent"
              >
                <GithubIcon aria-hidden="true" className="h-5 w-5" />
              </a>
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
