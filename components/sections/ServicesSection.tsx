import {
  TerminalIcon,
  RefreshCwIcon,
  CartIcon,
} from "@/components/icons/animated";
import type { AnimatedIcon } from "@/components/icons/animated";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import ServiceCard from "@/components/sections/ServiceCard";

type Service = {
  icon: AnimatedIcon;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    icon: TerminalIcon,
    title: "Desarrollo web desde cero",
    description:
      "Aplicaciones web completas, desde el diseño hasta el despliegue en producción.",
  },
  {
    icon: RefreshCwIcon,
    title: "Modernización de web existente",
    description:
      "Rediseño, optimización de rendimiento y actualización de tecnología.",
  },
  {
    icon: CartIcon,
    title: "E-commerce",
    description:
      "Tiendas online con gestión de productos, carrito y pasarela de pago integrada.",
  },
];

/** "Servicios" section: three service cards, each with a CTA to contact. */
export default function ServicesSection() {
  return (
    <section
      id="servicios"
      className="relative z-10 scroll-mt-[70px] pt-24 pb-56 sm:pt-28 sm:pb-64"
    >
      <div className="container-page">
        <AnimateOnScroll>
          <h2 className="font-display text-h2-mobile font-bold text-content sm:text-h2">
            Cómo puedo ayudarte
          </h2>
        </AnimateOnScroll>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <AnimateOnScroll key={service.title} delay={i * 50}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
