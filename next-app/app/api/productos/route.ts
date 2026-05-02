import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { PRODUCTOS } from "@/lib/productos";

// GET /api/productos — lista todos los productos activos
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("id");

    if (error) throw error;
    return NextResponse.json(data);
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
      .insert(body)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
