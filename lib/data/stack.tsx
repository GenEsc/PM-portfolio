import type { IconType } from "react-icons";
import {
  FaReact,
  FaAngular,
  FaHtml5,
  FaPlug,
  FaServer,
  FaDatabase,
  FaAws,
  FaArrowsRotate,
  FaDocker,
} from "react-icons/fa6";
import { SiTypescript, SiSpringboot, SiMicrosoftazure } from "react-icons/si";

export type Tech = {
  name: string;
  icon: IconType;
};

export type StackGroup = {
  title: string;
  items: Tech[];
};

/**
 * Technology stack, grouped in three columns.
 * 12 technologies in total — kept in sync with the "12 tecnologías" counter.
 * No proficiency bars by design: just icon + name.
 */
export const STACK: StackGroup[] = [
  {
    title: "Frontend",
    items: [
      { name: "React", icon: FaReact },
      { name: "Angular", icon: FaAngular },
      { name: "TypeScript", icon: SiTypescript },
      { name: "HTML / CSS", icon: FaHtml5 },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Java / Spring Boot", icon: SiSpringboot },
      { name: "APIs REST", icon: FaPlug },
      { name: "Microservicios", icon: FaServer },
      { name: "SQL / NoSQL", icon: FaDatabase },
    ],
  },
  {
    title: "DevOps",
    items: [
      { name: "AWS", icon: FaAws },
      { name: "Azure", icon: SiMicrosoftazure },
      { name: "CI/CD", icon: FaArrowsRotate },
      { name: "Docker", icon: FaDocker },
    ],
  },
];
