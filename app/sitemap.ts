import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { SITE } from "@/lib/data/site";

/** Auto-generated sitemap: home page + every project detail page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROJECTS.map((project) => ({
      url: `${SITE.url}/proyectos/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
