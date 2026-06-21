"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartContext";

export default function Header() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catalogo" },
    { href: "/#newsletter", label: "Novedades" },
    { href: "/#contacto", label: "Contacto" },
  ];

  return (
    <header className="header" id="top">
      <div className="header-inner">
        <Link href="/" className="logo">
          <img src="/img/r.png" alt="De Luca Sport" />
          <div className="logo-copy">
            <strong>De Luca Sport</strong>
            <span>Villa Bosch</span>
          </div>
        </Link>

        <nav
          className={`nav${menuOpen ? " open" : ""}`}
          id="main-nav"
          aria-label="Principal"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="header-pill pill-whatsapp"
            href="https://wa.me/5491165699188"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            className="header-pill pill-instagram"
            href="https://instagram.com/delucasportok"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <button className="cart-button pill-carrito" onClick={openCart} aria-label="Abrir carrito">
            <span>Carrito</span>
            {count > 0 && <span className="cart-counter">{count}</span>}
          </button>
          <button
            className="hamburger"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
