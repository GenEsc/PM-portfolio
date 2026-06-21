import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Projects from "@/components/sections/Projects";
import ServicesSection from "@/components/sections/ServicesSection";
import Contact from "@/components/sections/Contact";

/** Single-page home with anchored sections. */
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Stack />
      <Projects />
      <ServicesSection />
      <Contact />
    </main>
  );
}
