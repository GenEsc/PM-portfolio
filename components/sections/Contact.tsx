import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import ContactForm from "./ContactForm";
import { SITE } from "@/lib/data/site";

/**
 * "Contacto" section: heading, form, visible email and social links.
 *
 * This is where the career path "arrives": the background picks up the same
 * emerald the timeline path is drawn in (#1D9E75 → #0F6E56) and a filled dot at
 * the top marks the path's endpoint — signalling this was the destination all
 * along (see change-career-timeline.md §5). Text and form switch to white.
 */
export default function Contact() {
  return (
    <section
      id="contacto"
      className="relative scroll-mt-[70px] overflow-hidden bg-gradient-to-b from-accent to-accent-hover py-24 text-white sm:py-28"
    >
      {/* Path arrival point: a filled dot merging into the top of the section. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_8px_rgba(255,255,255,0.18)]"
      />

      <div className="container-page grid gap-12 md:grid-cols-2 md:gap-16">
        <AnimateOnScroll>
          <p className="font-mono text-sm font-medium uppercase tracking-widest text-white/80">
            Contacto
          </p>
          <h2 className="mt-3 font-display text-h2-mobile font-bold sm:text-h2">
            ¿Tienes un proyecto en mente? Hablemos.
          </h2>
          <p className="mt-4 text-lg text-white/85">
            Cuéntame qué necesitas y te responderé con los siguientes pasos.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-3 text-white transition-colors hover:text-white/80"
            >
              <FiMail aria-hidden="true" className="h-5 w-5" />
              {SITE.email}
            </a>
            <div className="flex gap-4 pt-2">
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <FiLinkedin aria-hidden="true" className="h-5 w-5" />
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <FiGithub aria-hidden="true" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <ContactForm onAccent />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
