import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";

// POST /api/ordenes — registra una nueva orden
export async function POST(request: Request) {
  try {
    const body: Omit<Order, "id" | "created_at"> = await request.json();

    // Validación básica
    if (!body.cliente_nombre || !body.cliente_email || !body.items?.length) {
      return NextResponse.json({ error: "Datos de orden incompletos." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("ordenes")
      .insert({ ...body, estado: "pendiente" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// GET /api/ordenes — lista órdenes (solo admin, en producción agregar verificación de auth)
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("ordenes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
