"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/data/site";

type Errors = {
  name?: string;
  email?: string;
  message?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form with client-side validation.
 *
 * Fields: name, email, project description. On submit it POSTs to
 * /api/contact (wired to Resend). No phone field in v1, by design.
 */
export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Indica tu nombre.";
    if (!email) next.email = "Indica tu email.";
    else if (!EMAIL_RE.test(email)) next.email = "El email no es válido.";
    if (!message) next.message = "Cuéntame brevemente tu proyecto.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-content">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-content outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/40"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1.5 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-content">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-content outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/40"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-content">
          Descripción del proyecto
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full resize-y rounded-lg border border-line bg-surface px-4 py-3 text-content outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/40"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-sm text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
      </button>

      {status === "success" && (
        <p role="status" className="text-sm font-medium text-accent">
          ¡Gracias! Te responderé lo antes posible.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-500">
          No se pudo enviar. Escríbeme directamente a {SITE.email}.
        </p>
      )}
    </form>
  );
}
