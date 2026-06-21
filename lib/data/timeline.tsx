import type { IconType } from "react-icons";
import { LuLandmark, LuCode2, LuLayers, LuUsers } from "react-icons/lu";

/**
 * Career milestones drawn along the scroll path (oldest → current).
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
  /** Short, factual role / description for this career stage. */
  role: string;
  /** Optional small context line (e.g. the end client). */
  note?: string;
  /** Generic, brand-neutral icon (no company logos). */
  icon: IconType;
};

export const MILESTONES: Milestone[] = [
  {
    company: "BBVA",
    role: "Modernización de plataforma de pagos (BBVA → Openpay → WipÖp)",
    icon: LuLandmark,
  },
  {
    company: "Dedalus",
    role: "Full Stack Developer · Java",
    icon: LuCode2,
  },
  {
    company: "Izertis",
    role: "Full Stack Developer",
    note: "Cliente: Verti",
    icon: LuLayers,
  },
  {
    company: "Verti",
    role: "Tech Lead · Liderazgo técnico y referente del equipo",
    icon: LuUsers,
  },
];
