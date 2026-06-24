import { GithubIcon, LinkedinIcon } from "@/components/icons/animated";
import Logo from "./Logo";
import { SITE } from "@/lib/data/site";

/** Site footer with brand, copyright and social links. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-10">
      <div className="container-page flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 text-content">
          <Logo className="h-7 w-7 text-accent" />
          <span className="font-display font-semibold">{SITE.shortName}</span>
        </div>

        <p className="text-sm text-content-muted">
          © {year} {SITE.name}. Todos los derechos reservados.
        </p>

        <div className="flex gap-4">
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-content-muted transition-colors hover:text-accent"
          >
            <LinkedinIcon size={20} aria-hidden="true" className="inline-flex" />
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-content-muted transition-colors hover:text-accent"
          >
            <GithubIcon size={20} aria-hidden="true" className="inline-flex" />
          </a>
        </div>
      </div>
    </footer>
  );
}
