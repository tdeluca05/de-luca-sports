"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import type { Producto } from "@/lib/types";

export default function FeaturedCarousel({ products }: { products: Producto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".product-card") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
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

      <div className="featured-track" ref={trackRef}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
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
