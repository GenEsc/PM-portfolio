import { Code, RefreshCw, ShoppingCart } from "lucide-react";
import type { IconType } from "@/lib/icon";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";

type Service = {
  icon: IconType;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    icon: Code,
    title: "Desarrollo web desde cero",
    description:
      "Aplicaciones web completas, desde el diseño hasta el despliegue en producción.",
  },
  {
    icon: RefreshCw,
    title: "Modernización de web existente",
    description:
      "Rediseño, optimización de rendimiento y actualización de tecnología.",
  },
  {
    icon: ShoppingCart,
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
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <AnimateOnScroll key={service.title} delay={i * 50}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent dark:bg-surface-secondary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-h3 font-semibold text-content">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-content-muted">
                    {service.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
