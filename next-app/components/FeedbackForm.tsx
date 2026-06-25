"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comentario.trim() && rating === 0) return;

    setEstado("enviando");
    // Guardado best-effort: aunque el backend no esté listo, agradecemos igual
    try {
      await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comentario: comentario.trim() }),
      });
    } catch {
      // si falla el guardado, no mostramos error
    }
    setEstado("ok");
  }

  if (estado === "ok") {
    return (
      <div className="feedback-gracias">
        ¡Gracias por tu comentario! 🙌
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3>¿Cómo fue tu experiencia?</h3>

      <div className="feedback-stars" role="radiogroup" aria-label="Puntuación">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`feedback-star${(hover || rating) >= n ? " on" : ""}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="feedback-textarea"
        placeholder="Dejanos tu comentario (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={3}
      />

      <button type="submit" className="btn btn-secondary" disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando..." : "Enviar comentario"}
      </button>
    </form>
  );
}
