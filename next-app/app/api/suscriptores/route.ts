import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { getResend, REMITENTE } from "@/lib/resend";

// Validación de formato de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/suscriptores — registra un email y le manda mail de confirmación
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 });
    }

    const limpio = email.trim().toLowerCase();
    const supabase = createAdminClient();

    // ¿Ya existe este email?
    const { data: existente } = await supabase
      .from("suscriptores")
      .select("confirmado")
      .eq("email", limpio)
      .maybeSingle();

    // Ya está suscripto y confirmado → no reenviamos nada
    if (existente?.confirmado) {
      return NextResponse.json({ ok: true, yaConfirmado: true }, { status: 200 });
    }

    // Token único para el link de confirmación
    const token = crypto.randomUUID();

    if (existente) {
      // Existe pero sin confirmar → renovamos el token
      await supabase.from("suscriptores").update({ token }).eq("email", limpio);
    } else {
      const { error } = await supabase
        .from("suscriptores")
        .insert({ email: limpio, token, confirmado: false });
      if (error && error.code !== "23505") {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    // Armamos el link de confirmación
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const link = `${siteUrl}/confirmar?token=${token}`;

    // Enviamos el mail de confirmación
    const resend = getResend();
    await resend.emails.send({
      from: REMITENTE,
      to: limpio,
      subject: "Confirmá tu suscripción — De Luca Sport",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #111;">De Luca Sport</h2>
          <p>¡Gracias por suscribirte! Para empezar a recibir nuestras novedades,
          confirmá tu email haciendo click en el botón:</p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${link}" style="background: #d92d20; color: #fff; text-decoration: none;
              padding: 14px 28px; border-radius: 999px; font-weight: bold; display: inline-block;">
              Confirmar suscripción
            </a>
          </p>
          <p style="color: #777; font-size: 13px;">Si no fuiste vos, podés ignorar este mail.</p>
        </div>
      `,
    });

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
