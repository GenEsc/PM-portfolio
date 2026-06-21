import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import ContactForm from "./ContactForm";
import { SITE } from "@/lib/data/site";

/** "Contacto" section: heading, form, visible email and social links. */
export default function Contact() {
  return (
    <section id="contacto" className="scroll-mt-[70px] py-24 sm:py-28">
      <div className="container-page grid gap-12 md:grid-cols-2 md:gap-16">
        <AnimateOnScroll>
          <p className="section-eyebrow">Contacto</p>
          <h2 className="mt-3 font-display text-h2-mobile font-bold text-content sm:text-h2">
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
              <FiMail aria-hidden="true" className="h-5 w-5 text-accent" />
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
                <FiLinkedin aria-hidden="true" className="h-5 w-5" />
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-content transition-colors hover:border-accent hover:text-accent"
              >
                <FiGithub aria-hidden="true" className="h-5 w-5" />
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
