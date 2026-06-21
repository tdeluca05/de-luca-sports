import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// Validación de formato de email (no garantiza que la casilla exista,
// pero descarta cualquier texto que no tenga forma de email)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/suscriptores — guarda un email en la lista de newsletter
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Ingresá un email válido." },
        { status: 400 }
      );
    }

    const limpio = email.trim().toLowerCase();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("suscriptores")
      .insert({ email: limpio });

    if (error) {
      // 23505 = violación de unique → el email ya estaba suscripto
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, duplicado: true }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// GET /api/suscriptores — lista de suscriptores (uso admin)
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("suscriptores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
