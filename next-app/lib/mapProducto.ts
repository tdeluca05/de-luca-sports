import type { Producto } from "./types";

// Supabase guarda las columnas en snake_case (talles_nota) y el resto
// de la app usa camelCase (tallesNota). Estas funciones traducen entre
// los dos formatos para que todo sea consistente.

/* eslint-disable @typescript-eslint/no-explicit-any */
export function dbToProducto(row: any): Producto {
  return {
    id: row.id,
    marca: row.marca,
    nombre: row.nombre,
    descripcion: row.descripcion ?? "",
    precio: row.precio,
    deporte: row.deporte ?? "running",
    tag: row.tag ?? "",
    badge: row.badge ?? "",
    imagenes: row.imagenes ?? [],
    talles: row.talles ?? [],
    tallesNota: row.talles_nota ?? "",
    activo: row.activo ?? true,
  };
}

// Convierte el producto del formulario (camelCase) al formato de la tabla
export function productoToDb(p: Omit<Producto, "id">) {
  return {
    marca: p.marca,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    deporte: p.deporte,
    tag: p.tag,
    badge: p.badge,
    imagenes: p.imagenes,
    talles: p.talles,
    talles_nota: p.tallesNota ?? "",
    activo: p.activo ?? true,
  };
}
