"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import type { Producto } from "@/lib/types";

interface Props {
  product: Producto;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(false);
  const [missingSize, setMissingSize] = useState(false);

  const fullName = `${product.marca.charAt(0).toUpperCase() + product.marca.slice(1)} ${product.nombre}`;

  function handleAddToCart() {
    if (!selectedSize) {
      setMissingSize(true);
      setTimeout(() => setMissingSize(false), 1200);
      return;
    }

    const cartId = `${product.id}-${selectedSize}`;
    addItem({
      cartId,
      productId: product.id,
      name: fullName,
      price: product.precio,
      size: selectedSize,
      qty: 1,
    });

    setFeedback(true);
    setTimeout(() => setFeedback(false), 1400);
  }

  const prevImage = () =>
    setImageIndex((i) => (i - 1 + product.imagenes.length) % product.imagenes.length);
  const nextImage = () =>
    setImageIndex((i) => (i + 1) % product.imagenes.length);

  const sizesLabel = `Talles disponibles${product.tallesNota ? ` ${product.tallesNota}` : ""}`;

  return (
    <article
      className="product-card"
      data-brand={product.marca}
      data-sport={product.deporte}
    >
      {/* Galería */}
      <div className="product-gallery">
        {product.imagenes.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${fullName} vista ${i + 1}`}
            className={i === imageIndex ? "active" : ""}
          />
        ))}

        {product.imagenes.length > 1 && (
          <>
            <button
              className="gallery-btn prev"
              type="button"
              aria-label="Imagen anterior"
              onClick={prevImage}
            >
              &#8249;
            </button>
            <button
              className="gallery-btn next"
              type="button"
              aria-label="Imagen siguiente"
              onClick={nextImage}
            >
              &#8250;
            </button>
            <div className="gallery-dots">
              {product.imagenes.map((_, i) => (
                <button
                  key={i}
                  className={`gallery-dot${i === imageIndex ? " active" : ""}`}
                  type="button"
                  aria-label={`Ir a imagen ${i + 1}`}
                  onClick={() => setImageIndex(i)}
                />
              ))}
            </div>
          </>
        )}

        <span className="product-badge">{product.badge}</span>
      </div>

      {/* Info */}
      <div className="product-info">
        <div className="product-meta">
          <span className="product-brand">
            {product.marca.charAt(0).toUpperCase() + product.marca.slice(1)}
          </span>
          <span className="product-tag">{product.tag}</span>
        </div>

        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-description">{product.descripcion}</p>

        <div className="product-price">
          {"$" + product.precio.toLocaleString("es-AR")}
        </div>

        <div>
          <div className="sizes-label">{sizesLabel}</div>
          <div className={`sizes-grid${missingSize ? " is-missing" : ""}`}>
            {product.talles.map((talle) => (
              <button
                key={talle}
                className={`size-btn${selectedSize === talle ? " selected" : ""}`}
                type="button"
                onClick={() => setSelectedSize(talle)}
              >
                {talle}
              </button>
            ))}
          </div>
        </div>

        <div className="product-actions">
          <button
            className="btn btn-primary btn-add-cart"
            type="button"
            onClick={handleAddToCart}
            disabled={feedback}
          >
            {feedback ? "¡Agregado!" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </article>
  );
}
