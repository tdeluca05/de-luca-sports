"use client";

// Panel de administración — CRUD de productos
// Requiere: Supabase configurado + usuario autenticado con rol admin

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Producto } from "@/lib/types";

const EMPTY_PRODUCT: Omit<Producto, "id"> = {
  marca: "reebook",
  nombre: "",
  descripcion: "",
  precio: 0,
  deporte: "running",
  tag: "",
  badge: "",
  imagenes: [],
  talles: [],
  tallesNota: "",
  activo: true,
};

export default function AdminPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState<Omit<Producto, "id">>(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Verificar sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
      setAuthChecked(true);
    });
  }, []);

  // Cargar productos
  useEffect(() => {
    if (!isAuthed) return;
    supabase
      .from("productos")
      .select("*")
      .order("id")
      .then(({ data }) => {
        if (data) setProductos(data);
        setLoading(false);
      });
  }, [isAuthed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword(loginForm);
    if (error) {
      setLoginError(error.message);
    } else {
      setIsAuthed(true);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      imagenes: typeof form.imagenes === "string"
        ? (form.imagenes as string).split(",").map((s) => s.trim())
        : form.imagenes,
      talles: typeof form.talles === "string"
        ? (form.talles as string).split(",").map(Number)
        : form.talles,
    };

    if (editing) {
      const { data } = await supabase
        .from("productos")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (data) setProductos((prev) => prev.map((p) => (p.id === editing.id ? data : p)));
    } else {
      const { data } = await supabase.from("productos").insert(payload).select().single();
      if (data) setProductos((prev) => [...prev, data]);
    }

    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("productos").delete().eq("id", id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  function handleEdit(p: Producto) {
    setEditing(p);
    setForm({
      marca: p.marca, nombre: p.nombre, descripcion: p.descripcion,
      precio: p.precio, deporte: p.deporte, tag: p.tag, badge: p.badge,
      imagenes: p.imagenes, talles: p.talles, tallesNota: p.tallesNota,
      activo: p.activo,
    });
  }

  // Pantalla de login
  if (authChecked && !isAuthed) {
    return (
      <div style={{ maxWidth: 400, margin: "10vh auto", padding: "2rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Admin — De Luca Sport</h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email" required placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }}
          />
          <input
            type="password" required placeholder="Contraseña"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }}
          />
          {loginError && <p style={{ color: "red", fontSize: "0.875rem" }}>{loginError}</p>}
          <button type="submit" className="btn btn-primary">Ingresar</button>
        </form>
      </div>
    );
  }

  if (!authChecked || loading) {
    return <div style={{ padding: "4rem", textAlign: "center" }}>Cargando...</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Admin — Productos</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="/" className="btn btn-secondary">Ver sitio</a>
          <button className="btn btn-secondary" onClick={() => supabase.auth.signOut().then(() => setIsAuthed(false))}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Formulario alta/edición */}
      <section style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", marginBottom: "2rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <h2 style={{ marginBottom: "1rem" }}>{editing ? "Editar producto" : "Agregar producto"}</h2>
        <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <input required placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={inputStyle} />
          <input required placeholder="Precio" type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} style={inputStyle} />
          <select value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} style={inputStyle}>
            <option value="reebook">Reebook</option>
            <option value="olympikus">Olympikus</option>
            <option value="topper">Topper</option>
            <option value="atomik">Atomik</option>
          </select>
          <select value={form.deporte} onChange={(e) => setForm({ ...form, deporte: e.target.value })} style={inputStyle}>
            <option value="running">Running</option>
            <option value="futbol">Futbol</option>
            <option value="tenis">Tenis</option>
            <option value="training">Training</option>
            <option value="accesorios">Accesorios</option>
          </select>
          <input placeholder="Tag (ej: Liviana)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} style={inputStyle} />
          <input placeholder="Badge (ej: Running)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} style={inputStyle} />
          <input
            placeholder="Imágenes (separadas por coma: /img/p1.jpg, /img/p2.jpg)"
            value={Array.isArray(form.imagenes) ? form.imagenes.join(", ") : form.imagenes}
            onChange={(e) => setForm({ ...form, imagenes: e.target.value as unknown as string[] })}
            style={{ ...inputStyle, gridColumn: "span 2" }}
          />
          <input
            placeholder="Talles (separados por coma: 38, 39, 40)"
            value={Array.isArray(form.talles) ? form.talles.join(", ") : form.talles}
            onChange={(e) => setForm({ ...form, talles: e.target.value as unknown as number[] })}
            style={inputStyle}
          />
          <input placeholder="Nota de talles (opcional)" value={form.tallesNota} onChange={(e) => setForm({ ...form, tallesNota: e.target.value })} style={inputStyle} />
          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            style={{ ...inputStyle, gridColumn: "span 2", height: 80 }}
          />
          <div style={{ display: "flex", gap: "0.75rem", gridColumn: "span 2" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar producto"}
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(null); setForm(EMPTY_PRODUCT); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tabla de productos */}
      <section style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              {["ID", "Nombre", "Marca", "Precio", "Deporte", "Activo", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.85rem" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}><strong>{p.nombre}</strong></td>
                <td style={tdStyle}>{p.marca}</td>
                <td style={tdStyle}>${p.precio.toLocaleString("es-AR")}</td>
                <td style={tdStyle}>{p.deporte}</td>
                <td style={tdStyle}>{p.activo ? "✅" : "❌"}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-secondary" onClick={() => handleEdit(p)} style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>Editar</button>
                    <button onClick={() => handleDelete(p.id)} style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", background: "#fee2e2", border: "none", borderRadius: 8, cursor: "pointer" }}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.75rem", borderRadius: 8,
  border: "1px solid #ddd", fontSize: "0.9rem", width: "100%",
};
const tdStyle: React.CSSProperties = { padding: "0.75rem 1rem", fontSize: "0.9rem" };
