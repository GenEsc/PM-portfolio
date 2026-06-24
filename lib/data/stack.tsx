import {
  ReactLogo,
  AngularLogo,
  TypeScriptLogo,
  Html5Logo,
  Css3Logo,
  JavaLogo,
  SpringLogo,
  PostgresLogo,
  MongoLogo,
  AwsLogo,
  AzureLogo,
  DockerLogo,
  GitLogo,
} from "@/components/icons/brand-logos";
import type { ComponentType } from "react";

/** developer-icons component: a coloured brand SVG sized via a `size` prop. */
export type BrandIcon = ComponentType<{ size?: number; className?: string }>;

export type Tech = {
  name: string;
  icon: BrandIcon;
};

export type StackGroup = {
  title: string;
  items: Tech[];
};

/**
 * Technology stack (13 logos from `developer-icons`, official brand colours).
 * Rendered as a magnetic, cursor-reactive grid on desktop and a draggable 3D
 * sphere on mobile (see components/stack/* and change-tech-stack-interactive.md).
 * Kept in sync with the "13 tecnologías" counter in lib/data/site.ts.
 */
export const STACK: StackGroup[] = [
  {
    title: "Frontend",
    items: [
      { name: "React", icon: ReactLogo },
      { name: "Angular", icon: AngularLogo },
      { name: "TypeScript", icon: TypeScriptLogo },
      { name: "HTML", icon: Html5Logo },
      { name: "CSS", icon: Css3Logo },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Java", icon: JavaLogo },
      { name: "Spring Boot", icon: SpringLogo },
      { name: "SQL", icon: PostgresLogo },
      { name: "NoSQL", icon: MongoLogo },
    ],
  },
  {
    title: "DevOps & Cloud",
    items: [
      { name: "AWS", icon: AwsLogo },
      { name: "Azure", icon: AzureLogo },
      { name: "Docker", icon: DockerLogo },
      { name: "Git", icon: GitLogo },
    ],
  },
];

export type TechWithCategory = Tech & { category: string };

/** Flat list of all 13 techs tagged with their category — used by the sphere. */
export const ALL_TECHS: TechWithCategory[] = STACK.flatMap((group) =>
  group.items.map((tech) => ({ ...tech, category: group.title }))
);
