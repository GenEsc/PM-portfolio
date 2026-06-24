/**
 * Portfolio projects.
 *
 * Two kinds of entry:
 *  - "professional": real career experience. Rendered as an informational card
 *    (generic icon + company name as styled text — never a real logo — + a short
 *    factual description). No tech tags, no demo/code links, no detail page.
 *  - "personal": demo/repo projects. Rendered as a clickable card with a
 *    screenshot, tech chips and a hover overlay, linking to a detail page.
 *
 * Launch (v1) shows only the professional cards. Personal demo projects will be
 * appended later as "personal" entries. See docs/CONTRIBUTING.md.
 */

/** Generic, brand-neutral icon keys (no company logos — trademark-safe). */
export type ProjectIcon = "bank" | "code" | "layers" | "team";

type BaseProject = {
  slug: string;
  title: string;
};

/**
 * Professional experience entry. The company name is shown as plain styled text
 * (trademark-safe), paired with a generic neutral icon.
 */
export type ProfessionalProject = BaseProject & {
  kind: "professional";
  /** Company name shown as styled text (never a logo). */
  company: string;
  /** Generic neutral icon key. */
  icon: ProjectIcon;
  /** Short, factual description shown on the card. */
  description: string;
};

/** Personal/demo project with a detail page, tech chips and demo/code links. */
export type PersonalProject = BaseProject & {
  kind: "personal";
  /** One-line summary shown on the card and used for SEO. */
  summary: string;
  /** The business problem the project solves. */
  problem: string;
  /** Longer description rendered on the detail page. */
  description: string;
  /** Technologies used, shown as monospace chips. */
  tech: string[];
  /** Path to the screenshot under /public. */
  image: string;
  /** Live demo URL ("#" while unavailable). */
  demoUrl: string;
  /** Source code URL ("#" while unavailable). */
  codeUrl: string;
  /** Bullet points for the "what was done" list on the detail page. */
  highlights: string[];
};

export type Project = ProfessionalProject | PersonalProject;

export const PROJECTS: Project[] = [
  {
    kind: "professional",
    slug: "bbva-wipop",
    company: "BBVA",
    icon: "bank",
    title: "Modernización de plataforma de pagos (BBVA → Openpay → WipÖp)",
    description:
      "Participación en la evolución de la plataforma de pagos digitales de BBVA, construida sobre la tecnología de Openpay y dando lugar a WipÖp, la nueva solución de pagos del banco para pymes y autónomos en España.",
  },
  {
    kind: "professional",
    slug: "verti-tech-lead",
    company: "Verti",
    icon: "team",
    title: "Liderazgo técnico y referente del equipo",
    description:
      "Rol actual como Tech Lead en Verti, liderando un equipo de 6 desarrolladores frontend. Responsable de decisiones de arquitectura, code reviews, definición de roadmap técnico y relación con producto.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
