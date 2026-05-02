import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import type { CartItem } from "./types";

// El cliente solo se inicializa en el servidor (API routes)
function getMpClient() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("MP_ACCESS_TOKEN no está configurada.");
  return new MercadoPagoConfig({ accessToken });
}

// Crea una preferencia de pago en Mercado Pago
export async function crearPreferencia(items: CartItem[], orderId: string) {
  const client = getMpClient();
  const preference = new Preference(client);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const result = await preference.create({
    body: {
      items: items.map((item) => ({
        id: String(item.productId),
        title: `${item.name} — Talle ${item.size}`,
        quantity: item.qty,
        unit_price: item.price,
        currency_id: "ARS",
      })),
      external_reference: orderId,
      back_urls: {
        success: `${siteUrl}/pago/exito`,
        failure: `${siteUrl}/pago/error`,
        pending: `${siteUrl}/pago/pendiente`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/pagos/webhook`,
    },
  });

  return result;
}

// Obtiene info de un pago (para verificar en el webhook)
export async function obtenerPago(paymentId: string) {
  const client = getMpClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}
