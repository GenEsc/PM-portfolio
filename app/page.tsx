import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Projects from "@/components/sections/Projects";
import ServicesSection from "@/components/sections/ServicesSection";
import Contact from "@/components/sections/Contact";
import ScrollStoryPath from "@/components/animation/ScrollStoryPath";

/**
 * Single-page home with anchored sections.
 *
 * <main> is the positioning context for ScrollStoryPath — a single full-page
 * emerald line drawn on scroll that starts below the hero, threads the career
 * milestones in "Proyectos", and arrives at the green contact section.
 */
export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <ScrollStoryPath />
      <Hero />
      <About />
      <Stack />
      <Projects />
      <ServicesSection />
      <Contact />
    </main>
  );
}
