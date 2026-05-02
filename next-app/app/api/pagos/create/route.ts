import { NextResponse } from "next/server";
import { crearPreferencia } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase";
import type { CartItem, OrderFormData } from "@/lib/types";

// POST /api/pagos/create
// Body: { items: CartItem[], formData: OrderFormData }
// Respuesta: { preferenceId, initPoint } — redirigir a initPoint para pagar
export async function POST(request: Request) {
  try {
    const { items, formData }: { items: CartItem[]; formData: OrderFormData } =
      await request.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Carrito vacío." }, { status: 400 });
    }

    const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

    // 1. Guardar la orden en Supabase con estado "pendiente"
    let orderId = "local-" + Date.now();
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("ordenes")
        .insert({
          cliente_nombre: formData.name,
          cliente_email: formData.email,
          cliente_telefono: formData.phone,
          entrega: formData.delivery,
          pago: "mercadopago",
          direccion: formData.address,
          items,
          total,
          estado: "pendiente",
        })
        .select()
        .single();
      if (data) orderId = data.id;
    } catch {
      // Supabase no configurado: continuar sin guardar
    }

    // 2. Crear preferencia en Mercado Pago
    const preference = await crearPreferencia(items, orderId);

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point, // URL de pago en producción
      sandboxInitPoint: preference.sandbox_init_point, // URL de pago en sandbox
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
