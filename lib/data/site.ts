/**
 * Central place for personal data and site-wide constants.
 * Update values here to change them everywhere (see docs/CONTRIBUTING.md).
 */

export const SITE = {
  name: "Pedro Escacena Macías",
  shortName: "Pedro Escacena",
  role: "Desarrollador web freelance",
  tagline:
    "Construyo aplicaciones web robustas y escalables para negocios que quieren crecer",
  email: "escpedmac@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedroescacena.dev",
  linkedin: "https://www.linkedin.com/in/pescacena",
  github: "https://github.com/GenEsc",
  availability: "Disponible para proyectos freelance",
} as const;

export const NAV_LINKS = [
  { label: "Inicio", href: "#inicio", id: "inicio" },
  { label: "Sobre mí", href: "#sobre-mi", id: "sobre-mi" },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "Proyectos", href: "#proyectos", id: "proyectos" },
  { label: "Servicios", href: "#servicios", id: "servicios" },
  { label: "Contacto", href: "#contacto", id: "contacto" },
] as const;

/** Section ids, kept in sync with NAV_LINKS for the active-link observer. */
export const SECTION_IDS = NAV_LINKS.map((link) => link.id);

/** Vertical offset (px) so anchored content is not hidden behind the navbar. */
export const SCROLL_OFFSET = 70;

/** Animated counters shown in the "Sobre mí" section. */
export const STATS = [
  { value: 5, label: "años de experiencia", suffix: "" },
  { value: 12, label: "tecnologías", suffix: "" },
  { value: 6, label: "devs liderados", suffix: "" },
] as const;
