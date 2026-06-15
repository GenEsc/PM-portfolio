import Hero from "@/components/Hero";
import About from "@/components/About";
import Stack from "@/components/Stack";
import Projects from "@/components/Projects";
import ServicesSection from "@/components/ServicesSection";
import Contact from "@/components/Contact";

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
