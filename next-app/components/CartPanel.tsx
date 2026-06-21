"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491165699188";

// Nombre: solo letras (con acentos), espacios, apóstrofes y guiones. Mínimo 2.
const NOMBRE_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,}$/;
// Email: formato válido (algo@algo.algo)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CartPanel() {
  const { items, isOpen, total, closeCart, removeItem, changeQty, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "form" | "success">("cart");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    delivery: "", payment: "", address: "",
  });

  function formatPrice(value: number) {
    return "$" + value.toLocaleString("es-AR");
  }

  // Al cambiar la entrega, si elige envío y tenía "efectivo en el local"
  // (que solo aplica a retiro), limpiamos el pago para que vuelva a elegir.
  function handleDeliveryChange(value: string) {
    setForm((f) => {
      const next = { ...f, delivery: value };
      if (value === "envio" && f.payment === "efectivo_local") {
        next.payment = "";
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!NOMBRE_REGEX.test(form.name.trim())) {
      setError("Ingresá un nombre y apellido válido (solo letras).");
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      setError("Ingresá un email válido (ej: nombre@gmail.com).");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 6) {
      setError("Ingresá un teléfono válido.");
      return;
    }
    if (!form.delivery) {
      setError("Elegí una forma de entrega.");
      return;
    }
    if (!form.payment) {
      setError("Elegí una forma de pago.");
      return;
    }
    if (form.delivery === "envio" && !form.address.trim()) {
      setError("Ingresá la dirección de entrega.");
      return;
    }
    // Coherencia: pagar en efectivo en el local solo si retira en el local
    if (form.payment === "efectivo_local" && form.delivery !== "retiro") {
      setError("El pago en efectivo en el local es solo para retiro.");
      return;
    }

    const lines = [
      "*Nuevo pedido — De Luca Sport*",
      "",
      `Nombre: ${form.name}`,
      `Telefono: ${form.phone}`,
      `Email: ${form.email}`,
      "",
      "*Productos:*",
      ...items.map((i) => `• ${i.name} — Talle ${i.size}${i.color ? ` — ${i.color}` : ""} x${i.qty}  (${formatPrice(i.price * i.qty)})`),
      "",
      `*Total: ${formatPrice(total)}*`,
      "",
      `Entrega: ${form.delivery === "retiro" ? "Retiro en el local" : "Envio a domicilio"}`,
      form.delivery === "envio" ? `Direccion: ${form.address}` : "",
      `Pago: ${form.payment}`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    clearCart();
    setStep("success");
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
        {step === "cart" && items.length === 0 && (
          <div className="cart-items">
            <div className="cart-empty">
              <strong>No agregaste productos todavia.</strong>
              <p>Selecciona un talle y suma pares para preparar el mensaje de compra.</p>
            </div>
          </div>
        )}

        {/* Items del carrito */}
        {step === "cart" && items.length > 0 && (
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

        {/* Formulario de checkout */}
        {step === "form" && (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-grid">
              <input
                required
                placeholder="Nombre y apellido"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value.replace(/[0-9]/g, "") })}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                required
                type="tel"
                placeholder="Telefono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d\s()+-]/g, "") })}
              />
              <select required value={form.delivery} onChange={(e) => handleDeliveryChange(e.target.value)}>
                <option value="">Entrega</option>
                <option value="retiro">Retiro en el local</option>
                <option value="envio">Envio a domicilio</option>
              </select>
              <select required value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>
                <option value="">Pago</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                {/* El efectivo en el local solo se ofrece si retira en el local */}
                {form.delivery !== "envio" && (
                  <option value="efectivo_local">Efectivo en el local</option>
                )}
                <option value="mercadopago">Mercado Pago</option>
              </select>
              {form.delivery === "envio" && (
                <input placeholder="Direccion de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              )}
            </div>
            {error && <p className="checkout-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-checkout">
              Finalizar compra
            </button>
            <button type="button" className="btn btn-secondary btn-back-cart" onClick={() => setStep("cart")}>
              Volver al carrito
            </button>
          </form>
        )}

        {/* Éxito */}
        {step === "success" && (
          <div className="checkout-success">
            <strong>Pedido enviado.</strong>
            <p>Se abrió WhatsApp con tu pedido listo para enviar.</p>
          </div>
        )}

        {/* Footer del carrito */}
        {step === "cart" && items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className="btn btn-primary btn-checkout" type="button" onClick={() => setStep("form")}>
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
