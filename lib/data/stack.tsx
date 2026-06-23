import { Plug, Server, Database, RefreshCw } from "lucide-react";
import type { IconType } from "@/lib/icon";
import {
  ReactIcon,
  AngularIcon,
  Html5Icon,
  AwsIcon,
  DockerIcon,
  TypeScriptIcon,
  SpringBootIcon,
  AzureIcon,
} from "@/components/icons/brand";

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
      { name: "React", icon: ReactIcon },
      { name: "Angular", icon: AngularIcon },
      { name: "TypeScript", icon: TypeScriptIcon },
      { name: "HTML / CSS", icon: Html5Icon },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Java / Spring Boot", icon: SpringBootIcon },
      { name: "APIs REST", icon: Plug },
      { name: "Microservicios", icon: Server },
      { name: "SQL / NoSQL", icon: Database },
    ],
  },
  {
    title: "DevOps",
    items: [
      { name: "AWS", icon: AwsIcon },
      { name: "Azure", icon: AzureIcon },
      { name: "CI/CD", icon: RefreshCw },
      { name: "Docker", icon: DockerIcon },
    ],
  },
];
