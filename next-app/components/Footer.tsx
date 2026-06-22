import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/">Inicio</Link>
          <Link href="/catalogo">Catalogo</Link>
          <Link href="/#contacto">Contacto</Link>
        </div>
        <p className="footer-copy">2026 | Villa Bosch | Sitio listo para venta directa por WhatsApp</p>
      </div>
    </footer>
  );
}
