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
import type { BrandIcon, TechAnimation } from "@/components/sections/TechIcon";

export type Tech = {
  name: string;
  icon: BrandIcon;
  /** Hover animation style (see TechIcon). */
  animation: TechAnimation;
};

export type StackGroup = {
  title: string;
  items: Tech[];
};

/**
 * Technology stack, grouped in three columns. Logos come from `developer-icons`
 * (official brand colours — not recoloured, per the library's MIT terms) and
 * animate on hover via Motion; the animation style per tech is chosen to suit
 * its logo (see change-animated-icons.md). 13 technologies in total — kept in
 * sync with the "13 tecnologías" counter in lib/data/site.ts.
 */
export const STACK: StackGroup[] = [
  {
    title: "Frontend",
    items: [
      { name: "React", icon: ReactLogo, animation: "spin" },
      { name: "Angular", icon: AngularLogo, animation: "spin" },
      { name: "TypeScript", icon: TypeScriptLogo, animation: "pulse" },
      { name: "HTML", icon: Html5Logo, animation: "bounce" },
      { name: "CSS", icon: Css3Logo, animation: "bounce" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Java", icon: JavaLogo, animation: "bounce" },
      { name: "Spring Boot", icon: SpringLogo, animation: "bounce" },
      { name: "SQL", icon: PostgresLogo, animation: "bounce" },
      { name: "NoSQL", icon: MongoLogo, animation: "bounce" },
    ],
  },
  {
    title: "DevOps & Cloud",
    items: [
      { name: "AWS", icon: AwsLogo, animation: "pulse" },
      { name: "Azure", icon: AzureLogo, animation: "pulse" },
      { name: "Docker", icon: DockerLogo, animation: "bounce" },
      { name: "Git", icon: GitLogo, animation: "shake" },
    ],
  },
];
