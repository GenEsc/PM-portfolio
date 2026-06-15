/**
 * Portfolio projects.
 *
 * These are placeholders for v1 — replace the content with real projects.
 * To add a project, append an entry here and (optionally) drop a screenshot
 * in /public/projects/. See docs/CONTRIBUTING.md for the full guide.
 */

export type Project = {
  slug: string;
  title: string;
  /** One-line summary shown on the card. */
  summary: string;
  /** The business problem the project solves. */
  problem: string;
  /** Longer description rendered on the detail page. */
  description: string;
  /** Technologies used, shown as monospace chips. */
  tech: string[];
  /** Path to the screenshot under /public (placeholder until real assets). */
  image: string;
  /** Live demo URL ("#" while it is a placeholder). */
  demoUrl: string;
  /** Source code URL ("#" while it is a placeholder). */
  codeUrl: string;
  /** Bullet points for the "what was done" list on the detail page. */
  highlights: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "ecommerce-placeholder",
    title: "E-commerce [nombre del negocio]",
    summary: "Plataforma de venta online con pasarela de pago.",
    problem:
      "El negocio vendía solo en tienda física y perdía clientes que querían comprar online.",
    description:
      "Tienda online completa con catálogo de productos, carrito, checkout y pasarela de pago integrada. Pensada para escalar con el crecimiento del negocio y fácil de gestionar para el propietario.",
    tech: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS", "PostgreSQL"],
    image: "/projects/placeholder-ecommerce.svg",
    demoUrl: "#",
    codeUrl: "#",
    highlights: [
      "Catálogo de productos con búsqueda y filtros",
      "Carrito persistente y checkout en varios pasos",
      "Pasarela de pago segura integrada",
      "Panel de gestión de pedidos para el propietario",
    ],
  },
  {
    slug: "modernizacion-placeholder",
    title: "Modernización web [nombre del negocio]",
    summary: "Rediseño y optimización de una web existente anticuada.",
    problem:
      "La web tenía un diseño desfasado, cargaba lento y no funcionaba bien en móvil, perjudicando la imagen del negocio.",
    description:
      "Rediseño completo de una web existente: nueva identidad visual, mejora drástica del rendimiento, accesibilidad y SEO, y migración a un stack moderno y mantenible.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite", "Lighthouse"],
    image: "/projects/placeholder-modernizacion.svg",
    demoUrl: "#",
    codeUrl: "#",
    highlights: [
      "Rediseño visual moderno y responsive",
      "Mejora del rendimiento y de las métricas Core Web Vitals",
      "Optimización SEO técnica y de contenidos",
      "Migración a un stack moderno y mantenible",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
