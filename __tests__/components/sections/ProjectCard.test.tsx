import { render, screen } from "@testing-library/react";
import ProjectCard from "@/components/sections/ProjectCard";
import {
  PROJECTS,
  type PersonalProject,
  type ProfessionalProject,
} from "@/lib/data/projects";

// PROJECTS holds the professional-experience cards for launch.
const professional = PROJECTS.find(
  (p): p is ProfessionalProject => p.kind === "professional"
)!;

// No personal projects exist yet, so build one to exercise that branch.
const personal: PersonalProject = {
  kind: "personal",
  slug: "demo-project",
  title: "Demo project",
  summary: "A short project summary.",
  problem: "The problem it solves.",
  description: "A longer description.",
  tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  image: "/projects/placeholder-ecommerce.svg",
  demoUrl: "#",
  codeUrl: "#",
  highlights: ["First highlight", "Second highlight"],
};

describe("ProjectCard", () => {
  describe("professional experience card", () => {
    it("renders the company name, title and description", () => {
      render(<ProjectCard project={professional} />);
      expect(
        screen.getByRole("heading", { name: professional.title })
      ).toBeInTheDocument();
      expect(screen.getByText(professional.company)).toBeInTheDocument();
      expect(screen.getByText(professional.description)).toBeInTheDocument();
    });

    it("is not clickable and has no tech chips or hover overlay", () => {
      render(<ProjectCard project={professional} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.queryByTestId("project-overlay")).not.toBeInTheDocument();
      expect(screen.queryByText("Ver demo")).not.toBeInTheDocument();
      expect(screen.queryByText("Ver código")).not.toBeInTheDocument();
    });
  });

  describe("personal project card", () => {
    it("renders the title and summary", () => {
      render(<ProjectCard project={personal} />);
      expect(
        screen.getByRole("heading", { name: personal.title })
      ).toBeInTheDocument();
      expect(screen.getByText(personal.summary)).toBeInTheDocument();
      expect(screen.getByText(/Proyecto personal/i)).toBeInTheDocument();
    });

    it("renders the tech stack chips", () => {
      render(<ProjectCard project={personal} />);
      for (const tech of personal.tech) {
        expect(screen.getByText(tech)).toBeInTheDocument();
      }
    });

    it("links to the project detail page", () => {
      render(<ProjectCard project={personal} />);
      expect(
        screen.getByRole("link", {
          name: `Ver detalle del proyecto ${personal.title}`,
        })
      ).toHaveAttribute("href", `/proyectos/${personal.slug}`);
    });

    it("contains a hover overlay with demo and code actions", () => {
      render(<ProjectCard project={personal} />);
      const overlay = screen.getByTestId("project-overlay");
      expect(overlay).toBeInTheDocument();
      // Hidden until hover: starts with opacity-0.
      expect(overlay.className).toContain("opacity-0");
      expect(overlay.className).toContain("group-hover:opacity-100");
      expect(screen.getByText("Ver demo")).toBeInTheDocument();
      expect(screen.getByText("Ver código")).toBeInTheDocument();
    });
  });
});
