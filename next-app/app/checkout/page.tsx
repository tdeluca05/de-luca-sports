"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { PRODUCTOS } from "@/lib/productos";

const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROVINCIAS = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones",
  "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
  "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

// Nombre válido = solo letras y al menos dos palabras de 2+ letras (nombre y apellido)
function nombreValido(n: string): boolean {
  const limpio = n.trim();
  if (!SOLO_LETRAS.test(limpio)) return false;
  const palabras = limpio.split(/\s+/).filter((w) => w.length >= 2);
  return palabras.length >= 2;
}

function imagenDe(productId: number): string {
  return PRODUCTOS.find((p) => p.id === productId)?.imagenes[0] || "";
}

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    name: "", email: "", phone: "", dni: "",
    delivery: "retiro",
    calle: "", numero: "", piso: "", depto: "",
    localidad: "", provincia: "", cp: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    // Al corregir, sacamos el resaltado de error de ese campo
    setInvalid((prev) => (prev[key] ? { ...prev, [key]: false } : prev));
  }

  function formatPrice(value: number) {
    return "$" + value.toLocaleString("es-AR");
  }

  function validar(): string | null {
    const inv: Record<string, boolean> = {};
    let msg: string | null = null;
    const fail = (field: string, m: string) => {
      inv[field] = true;
      if (!msg) msg = m;
    };

    if (!nombreValido(form.name)) fail("name", "Ingresá nombre y apellido (al menos dos palabras, solo letras).");
    if (!EMAIL_REGEX.test(form.email.trim())) fail("email", "Ingresá un email válido (ej: nombre@gmail.com).");
    if (form.phone.replace(/\D/g, "").length < 6) fail("phone", "Ingresá un teléfono válido.");
    if (form.dni.replace(/\D/g, "").length < 7) fail("dni", "Ingresá un DNI válido (7 u 8 números).");
    if (form.delivery === "envio") {
      if (!form.calle.trim()) fail("calle", "Completá la calle.");
      if (!form.numero.trim()) fail("numero", "Completá el número.");
      if (!form.localidad.trim()) fail("localidad", "Completá la localidad.");
      if (!form.provincia) fail("provincia", "Elegí la provincia.");
      if (form.cp.replace(/\D/g, "").length < 3) fail("cp", "Ingresá un código postal válido.");
    }

    setInvalid(inv);
    return msg;
  }

  function armarDireccion(): string {
    if (form.delivery === "retiro") return "Retiro en el local";
    const piso = form.piso ? `, Piso ${form.piso}` : "";
    const depto = form.depto ? ` Depto ${form.depto}` : "";
    return `${form.calle} ${form.numero}${piso}${depto}, ${form.localidad}, ${form.provincia} (CP ${form.cp})`;
  }

  async function handlePagar() {
    setError("");
    const err = validar();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pagos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          formData: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: `${form.phone} (DNI ${form.dni})`,
            delivery: form.delivery,
            payment: "mercadopago",
            address: armarDireccion(),
          },
        }),
      });

      const data = await res.json();
      const url = data.initPoint || data.sandboxInitPoint;
      if (res.ok && url) {
        window.location.href = url;
      } else {
        setError(data.error || "No se pudo iniciar el pago. Probá de nuevo.");
        setLoading(false);
      }
    } catch {
      setError("No se pudo iniciar el pago. Probá de nuevo.");
      setLoading(false);
    }
  }

  const cls = (field: string) => (invalid[field] ? "input-error" : "");

  // Carrito vacío
  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="checkout-page checkout-vacio">
          <h1>Tu carrito está vacío</h1>
          <p>Agregá productos para poder finalizar la compra.</p>
          <Link href="/catalogo" className="btn btn-primary">Ver catálogo</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="checkout-page">
        <Link href="/catalogo" className="detalle-back">← Seguir comprando</Link>
        <h1 className="checkout-title">Finalizar compra</h1>

        <div className="checkout-layout">
          {/* Columna izquierda: datos */}
          <div className="checkout-form-col">
            <section className="checkout-card">
              <h2>Tus datos</h2>
              <div className="checkout-fields">
                <input className={cls("name")} placeholder="Nombre y apellido *" value={form.name}
                  onChange={(e) => set("name", e.target.value.replace(/[0-9]/g, ""))} />
                <input className={cls("email")} type="email" placeholder="Email *" value={form.email}
                  onChange={(e) => set("email", e.target.value)} />
                <input className={cls("phone")} type="tel" placeholder="Teléfono *" value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/[^\d\s()+-]/g, ""))} />
                <input className={cls("dni")} placeholder="DNI *" value={form.dni}
                  onChange={(e) => set("dni", e.target.value.replace(/\D/g, ""))} />
              </div>
            </section>

            <section className="checkout-card">
              <h2>Entrega</h2>
              <div className="checkout-entrega">
                <label className={`entrega-opt${form.delivery === "retiro" ? " active" : ""}`}>
                  <input type="radio" name="delivery" checked={form.delivery === "retiro"}
                    onChange={() => set("delivery", "retiro")} />
                  <div>
                    <strong>Retiro en el local</strong>
                    <span>Santos Vega 5770, Villa Bosch — sin costo</span>
                  </div>
                </label>
                <label className={`entrega-opt${form.delivery === "envio" ? " active" : ""}`}>
                  <input type="radio" name="delivery" checked={form.delivery === "envio"}
                    onChange={() => set("delivery", "envio")} />
                  <div>
                    <strong>Envío a domicilio</strong>
                    <span>Coordinamos el envío a tu dirección</span>
                  </div>
                </label>
              </div>

              {form.delivery === "envio" && (
                <div className="checkout-fields checkout-direccion">
                  <input className={cls("calle")} placeholder="Calle *" value={form.calle} onChange={(e) => set("calle", e.target.value)} style={{ gridColumn: "span 2" }} />
                  <input className={cls("numero")} placeholder="Número *" value={form.numero} onChange={(e) => set("numero", e.target.value.replace(/\D/g, ""))} />
                  <input placeholder="Piso" value={form.piso} onChange={(e) => set("piso", e.target.value)} />
                  <input placeholder="Departamento" value={form.depto} onChange={(e) => set("depto", e.target.value)} />
                  <input className={cls("cp")} placeholder="Código Postal *" value={form.cp} onChange={(e) => set("cp", e.target.value.replace(/\D/g, ""))} />
                  <input className={cls("localidad")} placeholder="Localidad *" value={form.localidad} onChange={(e) => set("localidad", e.target.value)} />
                  <select className={cls("provincia")} value={form.provincia} onChange={(e) => set("provincia", e.target.value)}>
                    <option value="">Provincia *</option>
                    {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              )}
            </section>
          </div>

          {/* Columna derecha: resumen */}
          <aside className="checkout-summary">
            <h2>Tu pedido</h2>
            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.cartId} className="checkout-item">
                  <img className="checkout-item-img" src={imagenDe(item.productId)} alt={item.name} />
                  <div className="checkout-item-body">
                    <div className="checkout-item-name">{item.name}</div>
                    <div className="checkout-item-meta">
                      Talle {item.size}{item.color ? ` · ${item.color}` : ""} · x{item.qty}
                    </div>
                  </div>
                  <div className="checkout-item-price">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button className="btn btn-primary checkout-pagar" onClick={handlePagar} disabled={loading}>
              {loading ? "Redirigiendo..." : "Pagar con Mercado Pago"}
            </button>
            <p className="checkout-nota">Vas a ser redirigido a la pantalla segura de Mercado Pago.</p>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
