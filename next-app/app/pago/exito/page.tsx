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
