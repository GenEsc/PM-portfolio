import { render, screen } from "@testing-library/react";
import ProjectCard from "@/components/sections/ProjectCard";
import { PROJECTS } from "@/lib/data/projects";

const project = PROJECTS[0];

describe("ProjectCard", () => {
  it("renders the title and summary", () => {
    render(<ProjectCard project={project} />);
    expect(
      screen.getByRole("heading", { name: project.title })
    ).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
  });

  it("renders the tech stack chips", () => {
    render(<ProjectCard project={project} />);
    for (const tech of project.tech) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it("links to the project detail page", () => {
    render(<ProjectCard project={project} />);
    expect(
      screen.getByRole("link", {
        name: `Ver detalle del proyecto ${project.title}`,
      })
    ).toHaveAttribute("href", `/proyectos/${project.slug}`);
  });

  it("contains a hover overlay with demo and code actions", () => {
    render(<ProjectCard project={project} />);
    const overlay = screen.getByTestId("project-overlay");
    expect(overlay).toBeInTheDocument();
    // Hidden until hover: starts with opacity-0.
    expect(overlay.className).toContain("opacity-0");
    expect(overlay.className).toContain("group-hover:opacity-100");
    expect(screen.getByText("Ver demo")).toBeInTheDocument();
    expect(screen.getByText("Ver código")).toBeInTheDocument();
  });
});
