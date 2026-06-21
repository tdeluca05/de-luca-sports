import Link from "next/link";
import { createAdminClient } from "@/lib/supabase";

// Página a la que llega el link del mail de confirmación.
// Lee el token, marca al suscriptor como confirmado y muestra el resultado.
export default async function ConfirmarPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let confirmado = false;

  if (token) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("suscriptores")
        .update({ confirmado: true })
        .eq("token", token)
        .select()
        .maybeSingle();
      confirmado = !error && !!data;
    } catch {
      confirmado = false;
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "12vh auto", padding: "2rem", textAlign: "center" }}>
      {confirmado ? (
        <>
          <h1 style={{ fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>
            ¡Suscripción confirmada!
          </h1>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            Listo, ya vas a recibir nuestras novedades, ingresos y modelos destacados.
          </p>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>
            No pudimos confirmar
          </h1>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            El link no es válido o ya fue usado. Probá suscribirte de nuevo desde la página.
          </p>
        </>
      )}
      <Link href="/" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
        Volver al inicio
      </Link>
    </div>
  );
}
