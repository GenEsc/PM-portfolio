import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import { PROJECTS, getProjectBySlug } from "@/lib/data/projects";
import { SITE } from "@/lib/data/site";

type Params = { slug: string };

/** Pre-render a static page for every project at build time. */
export function generateStaticParams(): Params[] {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Params;
}): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Proyecto no encontrado" };

  const title = `${project.title} — ${SITE.shortName}`;
  return {
    title,
    description: project.summary,
    openGraph: {
      title,
      description: project.summary,
      type: "article",
      url: `${SITE.url}/proyectos/${project.slug}`,
      images: [{ url: project.image }],
    },
  };
}

export default function ProjectDetailPage({ params }: { params: Params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <main className="container-page py-28">
      <Link
        href="/#proyectos"
        className="inline-flex items-center gap-2 text-sm font-medium text-content-muted transition-colors hover:text-accent"
      >
        <FiArrowLeft aria-hidden="true" /> Volver a proyectos
      </Link>

      <article className="mt-8">
        <header>
          <h1 className="font-display text-h2-mobile font-bold text-content sm:text-h2">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-content-muted">
            {project.description}
          </p>
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface-secondary">
          <Image
            src={project.image}
            alt={`Captura del proyecto ${project.title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[2fr,1fr]">
          <section>
            <h2 className="font-display text-h3 font-semibold text-content">
              El problema
            </h2>
            <p className="mt-3 text-content-muted">{project.problem}</p>

            <h2 className="mt-8 font-display text-h3 font-semibold text-content">
              Qué se hizo
            </h2>
            <ul className="mt-3 space-y-2">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-content-muted">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <aside>
            <h2 className="font-display text-h3 font-semibold text-content">
              Stack
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-accent-hover dark:bg-surface-secondary dark:text-accent"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={project.demoUrl}
                target={project.demoUrl === "#" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FiExternalLink aria-hidden="true" /> Ver demo
              </a>
              <a
                href={project.codeUrl}
                target={project.codeUrl === "#" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <FiGithub aria-hidden="true" /> Ver código
              </a>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
