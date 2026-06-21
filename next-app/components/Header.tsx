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
          <button className="cart-icon-btn" onClick={openCart} aria-label="Abrir carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
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
