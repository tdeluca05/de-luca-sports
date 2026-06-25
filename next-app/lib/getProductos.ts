import { createAdminClient } from "./supabase";
import { PRODUCTOS } from "./productos";
import { dbToProducto } from "./mapProducto";
import type { Producto } from "./types";

// Lee los productos activos desde Supabase. Si Supabase no está disponible
// o no hay productos cargados, devuelve la lista local como respaldo.
// (uso del lado del servidor: API routes y server components)
export async function getProductos(): Promise<Producto[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("id");

    if (error || !data || data.length === 0) return PRODUCTOS;
    return data.map(dbToProducto);
  } catch {
    return PRODUCTOS;
  }
}
