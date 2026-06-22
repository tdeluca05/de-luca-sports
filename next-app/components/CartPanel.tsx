"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function CartPanel() {
  const router = useRouter();
  const { items, isOpen, total, closeCart, removeItem, changeQty, clearCart } = useCart();

  function formatPrice(value: number) {
    return "$" + value.toLocaleString("es-AR");
  }

  function irAlCheckout() {
    closeCart();
    router.push("/checkout");
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay open" onClick={closeCart} />
      <aside className="cart-panel open" aria-label="Carrito">
        <div className="cart-header-panel">
          <div>
            <span className="cart-kicker">Pedido</span>
            <h2>Tu carrito</h2>
          </div>
          <button className="cart-close" onClick={closeCart} aria-label="Cerrar carrito">
            &times;
          </button>
        </div>

        {/* Carrito vacío */}
        {items.length === 0 && (
          <div className="cart-items">
            <div className="cart-empty">
              <strong>No agregaste productos todavia.</strong>
              <p>Selecciona un talle y suma pares para preparar tu compra.</p>
            </div>
          </div>
        )}

        {/* Items del carrito */}
        {items.length > 0 && (
          <div className="cart-items">
            {items.map((item) => (
              <article key={item.cartId} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-size">
                    Talle {item.size}
                    {item.color ? ` · ${item.color}` : ""}
                  </div>
                  <div className="cart-item-price">{formatPrice(item.price * item.qty)}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" type="button" onClick={() => changeQty(item.cartId, -1)}>-</button>
                    <span className="qty-number">{item.qty}</span>
                    <button className="qty-btn" type="button" onClick={() => changeQty(item.cartId, 1)}>+</button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  type="button"
                  onClick={() => removeItem(item.cartId)}
                  aria-label="Eliminar"
                >
                  &times;
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Footer del carrito */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className="btn btn-primary btn-checkout" type="button" onClick={irAlCheckout}>
              Proceder con la compra
            </button>
            <button className="btn btn-secondary btn-checkout" type="button" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
