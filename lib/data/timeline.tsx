import { FolderCodeIcon, CreditCardIcon, UsersIcon } from "lucide-animated";
import type { AnimatedIcon } from "@/components/icons/animated";

/**
 * Career milestones shown as nodes along the scroll storyline (oldest →
 * current): Dedalus → BBVA → Verti. They live inside the "Proyectos" section
 * and sit on the full-page path drawn by ScrollStoryPath.
 *
 * Legal note (see change-career-timeline.md §3): company names are rendered as
 * plain styled text — never real logos — and each is paired with a generic,
 * brand-neutral icon. No internal technical detail is included; each milestone
 * states only company, role and a short factual description. The
 * BBVA → Openpay → WipÖp project naming is public information.
 */
export type Milestone = {
  /** Company name shown as styled text (never a logo — trademark-safe). */
  company: string;
  /** Year this stage started, shown next to the company in the node title. */
  year: string;
  /** Short role title, shown as the node subtitle. */
  role: string;
  /** One-paragraph factual summary of the position (node body). */
  summary: string;
  /** Generic, brand-neutral animated icon (no company logos). */
  icon: AnimatedIcon;
};

// Chronological order (oldest → current): Dedalus → BBVA → Verti.
export const MILESTONES: Milestone[] = [
  {
    company: "Dedalus",
    year: "2019",
    role: "Full Stack Developer",
    summary:
      "Primeros años como desarrollador full stack en Java: implementación de funcionalidades de backend y frontend, resolución de incidencias y mantenimiento de aplicaciones en producción.",
    icon: FolderCodeIcon,
  },
  {
    company: "BBVA",
    year: "2024",
    role: "Full Stack Developer · Plataforma de pagos",
    summary:
      "Evolución de la plataforma de pagos digitales del banco (Openpay → WipÖp), la nueva solución de pagos para pymes y autónomos en España.",
    icon: CreditCardIcon,
  },
  {
    company: "Verti",
    year: "2026",
    role: "Tech Lead",
    summary:
      "Liderazgo de un equipo de 6 desarrolladores frontend: decisiones de arquitectura, code reviews, definición del roadmap técnico y relación con producto.",
    icon: UsersIcon,
  },
];
