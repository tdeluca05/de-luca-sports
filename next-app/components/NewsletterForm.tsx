"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setMensaje("");

    try {
      const res = await fetch("/api/suscriptores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setEstado("ok");
        setMensaje(
          data.yaConfirmado
            ? "Este email ya está suscripto y confirmado."
            : "¡Casi listo! Te mandamos un mail para confirmar tu suscripción."
        );
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setEstado("error");
        setMensaje(data.error || "No pudimos suscribirte. Probá de nuevo.");
      }
    } catch {
      setEstado("error");
      setMensaje("No pudimos suscribirte. Probá de nuevo.");
    }
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
