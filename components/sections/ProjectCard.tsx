import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Landmark, Code2, Layers, Users } from "lucide-react";
import { GithubIcon } from "@/components/icons/brand";
import type { IconType } from "@/lib/icon";
import type {
  Project,
  ProfessionalProject,
  PersonalProject,
  ProjectIcon,
} from "@/lib/data/projects";

/** Generic, brand-neutral icons (no company logos — trademark-safe). */
const ICONS: Record<ProjectIcon, IconType> = {
  bank: Landmark,
  code: Code2,
  layers: Layers,
  team: Users,
};

/**
 * Renders a project card. Professional-experience entries are informational
 * (icon + styled company name + description, not clickable); personal/demo
 * projects keep the screenshot, tech chips, hover overlay and detail link.
 */
export default function ProjectCard({ project }: { project: Project }) {
  return project.kind === "professional" ? (
    <ProfessionalCard project={project} />
  ) : (
    <PersonalCard project={project} />
  );
}

function ProfessionalCard({ project }: { project: ProfessionalProject }) {
  const Icon = ICONS[project.icon];
  return (
    <article
      data-testid="project-card"
      data-kind="professional"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="flex items-center gap-4 border-b border-line bg-accent-soft px-6 py-5 dark:bg-surface-secondary">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-surface text-accent">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        {/* Company name as styled text — never a real logo (trademark-safe). */}
        <span className="font-display text-2xl font-bold tracking-tight text-content">
          {project.company}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mt-3 font-display text-h3 font-semibold text-content">
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-content-muted">{project.description}</p>
      </div>
    </article>
  );
}

function PersonalCard({ project }: { project: PersonalProject }) {
  return (
    <article
      data-testid="project-card"
      data-kind="personal"
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
              <ExternalLink aria-hidden="true" /> Ver demo
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white">
              <GithubIcon aria-hidden="true" /> Ver código
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <span className="section-eyebrow text-xs">Proyecto personal</span>
        <h3 className="mt-3 font-display text-h3 font-semibold text-content">
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
