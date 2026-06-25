import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { dbToProducto, productoToDb } from "@/lib/mapProducto";
import { PRODUCTOS } from "@/lib/productos";

// GET /api/productos — lista todos los productos activos (formato camelCase)
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("id");

    if (error || !data || data.length === 0) {
      return NextResponse.json(PRODUCTOS);
    }
    return NextResponse.json(data.map(dbToProducto));
  } catch {
    // Supabase no configurado: devuelve los datos locales como fallback
    return NextResponse.json(PRODUCTOS);
  }
}

// POST /api/productos — crea un producto (solo admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("productos")
      .insert(productoToDb(body))
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(dbToProducto(data), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
