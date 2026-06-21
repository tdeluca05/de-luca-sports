"use client";

import { useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { PRODUCTOS } from "@/lib/productos";

export default function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const found = PRODUCTOS.find((p) => p.id === Number(id));

  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    found?.colores?.[0]?.hex ?? null
  );
  const [feedback, setFeedback] = useState(false);
  const [missingSize, setMissingSize] = useState(false);

  if (!found) return notFound();

  const brandName = found.marca.charAt(0).toUpperCase() + found.marca.slice(1);
  const fullName = `${brandName} ${found.nombre}`;

  // Suma el producto al carrito. Devuelve true si lo logró (false si falta el talle).
  function agregarAlCarrito(): boolean {
    if (!selectedSize) {
      setMissingSize(true);
      setTimeout(() => setMissingSize(false), 1200);
      return false;
    }
    const colorNombre = found!.colores?.find((c) => c.hex === selectedColor)?.nombre;
    addItem({
      cartId: `${found!.id}-${selectedSize}-${colorNombre ?? ""}`,
      productId: found!.id,
      name: fullName,
      price: found!.precio,
      size: selectedSize,
      color: colorNombre,
      qty: 1,
    });
    return true;
  }

  // "Agregar al carrito": suma y muestra feedback, sin abrir el carrito
  function handleAddToCart() {
    if (agregarAlCarrito()) {
      setFeedback(true);
      setTimeout(() => setFeedback(false), 1400);
    }
  }

  // "Comprar ahora": suma y abre el carrito para finalizar la compra
  function handleComprar() {
    if (agregarAlCarrito()) {
      openCart();
    }
  }

  const sizesLabel = `Seleccionar Talle${found.tallesNota ? ` ${found.tallesNota}` : ""}`;

  return (
    <div className="detalle-shell">
      <button className="detalle-back" onClick={() => router.back()} type="button">
        ← Volver
      </button>

      <div className="detalle-layout">
        {/* Galería */}
        <div className="detalle-gallery">
          <div className="detalle-thumbs">
            {found.imagenes.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`detalle-thumb${i === mainImage ? " active" : ""}`}
                onClick={() => setMainImage(i)}
              >
                <img src={src} alt={`${fullName} vista ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="detalle-main-img">
            <img src={found.imagenes[mainImage]} alt={fullName} />
          </div>
        </div>

        {/* Info */}
        <div className="detalle-info">
          <span className="detalle-marca">{brandName}</span>
          <h1 className="detalle-nombre">{found.nombre}</h1>
          <div className="detalle-precio">{"$" + found.precio.toLocaleString("es-AR")}</div>

          {/* Colores */}
          {found.colores && found.colores.length > 0 && (
            <div className="detalle-section">
              <div className="detalle-section-label">
                Color: <strong>{found.colores.find((c) => c.hex === selectedColor)?.nombre}</strong>
              </div>
              <div className="detalle-colors">
                {found.colores.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`color-swatch${selectedColor === c.hex ? " active" : ""}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.nombre}
                    onClick={() => setSelectedColor(c.hex)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Talles */}
          <div className="detalle-section">
            <div className="detalle-section-label">{sizesLabel}</div>
            <div className={`sizes-grid detalle-sizes${missingSize ? " is-missing" : ""}`}>
              {found.talles.map((talle) => (
                <button
                  key={talle}
                  type="button"
                  className={`size-btn${selectedSize === talle ? " selected" : ""}`}
                  onClick={() => setSelectedSize(talle)}
                >
                  {talle}
                </button>
              ))}
            </div>
          </div>

          <div className="detalle-acciones">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleComprar}
            >
              Comprar ahora
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleAddToCart}
              disabled={feedback}
            >
              {feedback ? "¡Agregado al carrito!" : "Agregar al carrito"}
            </button>
          </div>

          {/* Descripción */}
          <div className="detalle-section">
            <div className="detalle-section-label">Descripción</div>
            <p style={{ color: "#555", lineHeight: 1.6 }}>{found.descripcion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
