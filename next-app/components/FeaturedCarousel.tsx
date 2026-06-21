"use client";

import { useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import type { Producto } from "@/lib/types";

export default function FeaturedCarousel({ products }: { products: Producto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Triplicamos la lista: copia izquierda + central + derecha.
  // El usuario siempre está mirando la copia central; cuando el scroll
  // se acerca a un borde, lo reposicionamos a la copia central. Como el
  // contenido es idéntico, el salto es invisible → sensación de infinito.
  const items = [...products, ...products, ...products];

  // Ancho de un bloque (una copia completa de la lista)
  function blockWidth() {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector(".product-card") as HTMLElement | null;
    const gap = 24;
    const step = card ? card.offsetWidth + gap : 300;
    return step * products.length;
  }

  function stepWidth() {
    const track = trackRef.current;
    if (!track) return 300;
    const card = track.querySelector(".product-card") as HTMLElement | null;
    return card ? card.offsetWidth + 24 : 300;
  }

  // Arrancamos en la copia central
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = blockWidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const block = blockWidth();
    if (block === 0) return;
    // Si nos pasamos a la copia derecha, volvemos una copia atrás
    if (track.scrollLeft >= block * 2) {
      track.scrollLeft -= block;
    } else if (track.scrollLeft <= 0) {
      track.scrollLeft += block;
    }
  }

  function scroll(dir: number) {
    trackRef.current?.scrollBy({ left: dir * stepWidth(), behavior: "smooth" });
  }

  return (
    <div className="featured-carousel">
      <button
        className="products-nav prev"
        type="button"
        aria-label="Productos anteriores"
        onClick={() => scroll(-1)}
      >
        &#8249;
      </button>

      <div className="featured-track" ref={trackRef} onScroll={handleScroll}>
        {items.map((p, i) => (
          <ProductCard key={`${p.id}-${i}`} product={p} />
        ))}
      </div>

      <button
        className="products-nav next"
        type="button"
        aria-label="Productos siguientes"
        onClick={() => scroll(1)}
      >
        &#8250;
      </button>
    </div>
  );
}
