"use client";

import Link from "next/link";
import type { Producto } from "@/lib/types";

interface Props {
  product: Producto;
}

export default function ProductCard({ product }: Props) {
  const brandName = product.marca.charAt(0).toUpperCase() + product.marca.slice(1);

  return (
    <Link href={`/producto/${product.id}`} className="product-card">
      <div className="product-gallery">
        <img
          className="active"
          src={product.imagenes[0]}
          alt={`${brandName} ${product.nombre}`}
        />
      </div>

      <div className="product-info">
        <div className="product-meta">
          <span className="product-brand">{brandName}</span>
        </div>
        <h3 className="product-name">{product.nombre}</h3>

        <div className="product-price">
          {"$" + product.precio.toLocaleString("es-AR")}
        </div>

        {product.colores && product.colores.length > 0 && (
          <div className="product-colors">
            {product.colores.map((c) => (
              <span
                key={c.hex}
                className="color-dot"
                style={{ backgroundColor: c.hex }}
                title={c.nombre}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
