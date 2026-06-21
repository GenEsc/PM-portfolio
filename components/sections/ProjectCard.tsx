import Image from "next/image";
import Link from "next/link";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { Project } from "@/lib/data/projects";

/**
 * Project card with a hover overlay.
 *
 * The whole card links to the project detail page. On hover the card lifts
 * slightly (scale 1.02) and a dark-green overlay fades in over the image,
 * revealing the "Ver demo" and "Ver código" buttons.
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-testid="project-card"
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-200 hover:scale-[1.02]"
    >
      <Link
        href={`/proyectos/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`Ver detalle del proyecto ${project.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-secondary">
          <Image
            src={project.image}
            alt={`Captura del proyecto ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />

          {/* Hover overlay */}
          <div
            data-testid="project-overlay"
            className="absolute inset-0 flex items-center justify-center gap-3 bg-[rgba(15,110,86,0.88)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white">
              <FiExternalLink aria-hidden="true" /> Ver demo
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white">
              <FiGithub aria-hidden="true" /> Ver código
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <h3 className="font-display text-h3 font-semibold text-content">
          {project.title}
        </h3>
        <p className="mt-2 text-content-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-accent-hover dark:bg-surface-secondary dark:text-accent"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
