"use client";

import { useState, type FormEvent } from "react";
import { SendIcon } from "lucide-animated";
import useIconHover from "@/components/icons/useIconHover";
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
 *
 * `onAccent` switches to a light-on-emerald palette so the form stays legible
 * on the green contact block (see change-career-timeline.md §5).
 */
export default function ContactForm({ onAccent = false }: { onAccent?: boolean }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const sendIcon = useIconHover();

  const labelClass = onAccent ? "text-white/90" : "text-content";
  const fieldClass = onAccent
    ? "w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition-colors focus:border-white focus:ring-2 focus:ring-white/40"
    : "w-full rounded-lg border border-line bg-surface px-4 py-3 text-content outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/40";
  const errorClass = onAccent ? "mt-1.5 text-sm text-white" : "mt-1.5 text-sm text-red-500";
  const buttonClass = onAccent
    ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-accent-hover transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent disabled:opacity-70 sm:w-auto"
    : "btn-primary w-full sm:w-auto";

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
        <label htmlFor="name" className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={fieldClass}
        />
        {errors.name && (
          <p id="name-error" role="alert" className={errorClass}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClass}
        />
        {errors.email && (
          <p id="email-error" role="alert" className={errorClass}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
          Descripción del proyecto
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
        {errors.message && (
          <p id="message-error" role="alert" className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={buttonClass}
        disabled={status === "submitting"}
        onMouseEnter={sendIcon.onMouseEnter}
        onMouseLeave={sendIcon.onMouseLeave}
      >
        {status === "submitting" ? (
          "Enviando…"
        ) : (
          <>
            <SendIcon ref={sendIcon.ref} size={18} animateOnHover={false} />
            Enviar mensaje
          </>
        )}
      </button>

      {status === "success" && (
        <p role="status" className={`text-sm font-medium ${onAccent ? "text-white" : "text-accent"}`}>
          ¡Gracias! Te responderé lo antes posible.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className={`text-sm font-medium ${onAccent ? "text-white" : "text-red-500"}`}>
          No se pudo enviar. Escríbeme directamente a {SITE.email}.
        </p>
      )}
    </form>
  );
}
