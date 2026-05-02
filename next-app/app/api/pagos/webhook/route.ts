import { NextResponse } from "next/server";
import { obtenerPago } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase";

// POST /api/pagos/webhook
// Mercado Pago llama a esta URL cuando cambia el estado de un pago.
// Configurar en: developers.mercadopago.com > Webhooks > notification_url
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mercado Pago envía distintos tipos de notificaciones
    // Solo procesamos pagos (topic: "payment")
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = String(body.data?.id);
    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID faltante." }, { status: 400 });
    }

    // Obtener info del pago desde la API de Mercado Pago
    const payment = await obtenerPago(paymentId);

    const orderId = payment.external_reference;
    const status = payment.status; // "approved" | "pending" | "rejected"

    // Mapear estado de MP a nuestro sistema
    const estadoMap: Record<string, string> = {
      approved: "pagado",
      pending: "pendiente",
      rejected: "cancelado",
      cancelled: "cancelado",
    };
    const nuevoEstado = estadoMap[status || ""] || "pendiente";

    // Actualizar la orden en Supabase
    try {
      const supabase = createAdminClient();
      await supabase
        .from("ordenes")
        .update({
          estado: nuevoEstado,
          mp_payment_id: paymentId,
        })
        .eq("id", orderId);
    } catch {
      // Supabase no configurado: loguear y continuar
      console.log(`Webhook recibido: orden ${orderId} → ${nuevoEstado}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("Webhook error:", message);
    // Devolver 200 de todas formas para que MP no reintente indefinidamente
    return NextResponse.json({ ok: false, error: message });
  }
}
