import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-[70svh] flex-col items-center justify-center text-center">
      <p className="section-eyebrow">404</p>
      <h1 className="mt-3 font-display text-h2-mobile font-bold text-content sm:text-h2">
        Página no encontrada
      </h1>
      <p className="mt-4 max-w-md text-content-muted">
        La página que buscas no existe o se ha movido.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </main>
  );
}
