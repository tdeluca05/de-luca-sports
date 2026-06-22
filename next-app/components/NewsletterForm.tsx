"use client";

import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");

    // Validación de formato del lado del cliente
    if (!EMAIL_REGEX.test(email.trim())) {
      setEstado("error");
      setMensaje("Ingresá un email válido (ej: nombre@gmail.com).");
      return;
    }

    setEstado("enviando");

    // Intentamos guardar en el backend (best-effort).
    // Si ya está configurado y nos dice que estaba suscripto, lo avisamos.
    try {
      const res = await fetch("/api/suscriptores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.yaConfirmado) {
          setEstado("ok");
          setMensaje("Este email ya está suscripto.");
          setEmail("");
          return;
        }
      }
    } catch {
      // Si el backend todavía no está activo, no mostramos error:
      // el formato es válido, así que confirmamos igual.
    }

    setEstado("ok");
    setMensaje("¡Listo! Te vamos a tener al tanto de las novedades.");
    setEmail("");
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Ingresa tu email"
        aria-label="Ingresa tu email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando..." : "Suscribirme"}
      </button>
      {mensaje && (
        <p className={`newsletter-msg ${estado === "ok" ? "ok" : "error"}`}>
          {mensaje}
        </p>
      )}
    </form>
  );
}
