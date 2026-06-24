"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";

export default function PagoExitoPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Pago aprobado: vaciamos el carrito
    clearCart();

    // 🍾 Descorche: disparo inicial hacia arriba (como el corcho)
    confetti({
      particleCount: 140,
      spread: 80,
      startVelocity: 55,
      origin: { x: 0.5, y: 0.7 },
    });

    // Cañones laterales un toque después
    const t1 = setTimeout(() => {
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

    return () => {
      clearTimeout(t1);
      clearInterval(intervalo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className="pago-resultado">
        <div className="pago-icono pago-ok">✓</div>
        <h1>¡Pago aprobado! 🍾</h1>
        <p>Recibimos tu pago. Te vamos a contactar para coordinar la entrega.</p>
        <Link href="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
      <Footer />
    </>
  );
}
