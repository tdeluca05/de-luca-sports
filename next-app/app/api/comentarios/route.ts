import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// POST /api/comentarios — guarda un comentario/feedback del cliente
export async function POST(request: Request) {
  try {
    const { rating, comentario } = await request.json();

    const r = Number(rating) > 0 ? Number(rating) : null;
    const c = typeof comentario === "string" ? comentario.trim() : "";

    if (!c && !r) {
      return NextResponse.json({ error: "Comentario vacío." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("comentarios")
      .insert({ rating: r, comentario: c });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// GET /api/comentarios — lista de comentarios (uso admin)
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("comentarios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
