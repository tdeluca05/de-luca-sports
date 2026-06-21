import { Resend } from "resend";

// Cliente de Resend para enviar emails (solo server-side).
// La API key se obtiene en resend.com > API Keys.
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY no está configurada.");
  }
  return new Resend(key);
}

// Remitente. Mientras no haya un dominio propio verificado en Resend,
// se usa el dominio de prueba onboarding@resend.dev (solo envía a tu
// propio email). Con dominio propio: "De Luca Sport <hola@tudominio.com>".
export const REMITENTE = "De Luca Sport <onboarding@resend.dev>";
