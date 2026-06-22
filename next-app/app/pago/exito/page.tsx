"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";

export default function PagoExitoPage() {
  const { clearCart } = useCart();

  // Pago aprobado: vaciamos el carrito
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className="pago-resultado">
        <div className="pago-icono pago-ok">✓</div>
        <h1>¡Pago aprobado!</h1>
        <p>Recibimos tu pago. Te vamos a contactar para coordinar la entrega.</p>
        <Link href="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
      <Footer />
    </>
  );
}
