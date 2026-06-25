"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import FeedbackForm from "@/components/FeedbackForm";
import { useCart } from "@/components/CartContext";

// Lanza toda la fiesta de confetti
function celebrar() {
  // 🍾 Descorche: disparo inicial hacia arriba (como el corcho)
  confetti({
    particleCount: 140,
    spread: 80,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.7 },
  });

  // Cañones laterales un toque después
  setTimeout(() => {
    confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0 } });
    confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1 } });
  }, 250);

  // Lluvia suave de papelitos durante ~2 segundos
  const fin = Date.now() + 2200;
  const intervalo = setInterval(() => {
    if (Date.now() > fin) {
      clearInterval(intervalo);
      return;
    }
    confetti({
      particleCount: 30,
      spread: 70,
      startVelocity: 30,
      origin: { x: Math.random(), y: -0.1 },
      gravity: 0.8,
      ticks: 200,
    });
  }, 280);
}

export default function PagoExitoPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Pago aprobado: vaciamos el carrito y arrancamos la fiesta
    clearCart();
    celebrar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />

      <div className="pago-resultado">
        <div className="pago-icono pago-ok">✓</div>
        <h1>¡Pago aprobado! 🍾</h1>
        <p>Recibimos tu pago. Te vamos a contactar para coordinar la entrega.</p>
        <div className="pago-acciones">
          <a
            href="https://wa.me/5491165699188"
            target="_blank"
            rel="noreferrer"
            className="btn-wpp-circle"
            aria-label="Contactarnos por WhatsApp"
            title="Escribinos por WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
          <Link href="/" className="btn btn-primary">Volver al inicio</Link>
          <button
            type="button"
            className="btn-festin"
            onClick={celebrar}
            aria-label="Repetir celebración"
            title="¡Otra vez!"
          >
            🎉
          </button>
        </div>

        <FeedbackForm />
      </div>
    </>
  );
}
