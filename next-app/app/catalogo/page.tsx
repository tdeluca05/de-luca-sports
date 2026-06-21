"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import ProductCard from "@/components/ProductCard";
import { PRODUCTOS } from "@/lib/productos";

type FilterBrand = "all" | "reebook" | "olympikus" | "topper" | "atomik";
type FilterDeporte = "all" | "running" | "futbol" | "tenis" | "training" | "accesorios";
type SortOrder = "default" | "price-asc" | "price-desc" | "name-asc";

// Pasa a minúsculas y saca tildes para que la búsqueda sea tolerante
// ("córrida" coincide con "corrida", "REEBOK" con "reebok").
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function CatalogoPage() {
  const [brand, setBrand] = useState<FilterBrand>("all");
  const [deporte, setDeporte] = useState<FilterDeporte>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("default");

  const filtered = useMemo(() => {
    let result = PRODUCTOS.filter((p) => p.activo !== false);

    if (brand !== "all") result = result.filter((p) => p.marca === brand);
    if (deporte !== "all") result = result.filter((p) => p.deporte === deporte);
    if (search.trim()) {
      // Separa la búsqueda en palabras (ignora espacios de más)
      const terms = normalizar(search).split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        // Junta todos los campos donde buscar, normalizados (sin tildes)
        const texto = normalizar(`${p.nombre} ${p.marca} ${p.deporte} ${p.tag}`);
        // El producto coincide si contiene TODAS las palabras buscadas
        return terms.every((t) => texto.includes(t));
      });
    }

    if (sort === "price-asc") result = [...result].sort((a, b) => a.precio - b.precio);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.precio - a.precio);
    if (sort === "name-asc") result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

    return result;
  }, [brand, deporte, search, sort]);

  const marcas: { value: FilterBrand; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "reebook", label: "Reebook" },
    { value: "olympikus", label: "Olympikus" },
    { value: "topper", label: "Topper" },
    { value: "atomik", label: "Atomik" },
  ];

  return (
    <>
      <Header />

      <main>
        <section className="products-section" id="productos">
          <div className="section-heading products-heading">
            <div>
              <span className="eyebrow eyebrow-dark">Catalogo</span>
              <h2>Modelos listos para consultar y vender.</h2>
            </div>
          </div>

          {/* Toolbar de filtros */}
          <div className="toolbar">
            <div className="filters" role="tablist" aria-label="Filtrar por marca">
              {marcas.map((m) => (
                <button
                  key={m.value}
                  className={`filter-chip${brand === m.value ? " active" : ""}`}
                  type="button"
                  onClick={() => setBrand(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="catalog-controls">
              <label className="catalog-sort">
                <select
                  aria-label="Filtrar por deporte"
                  value={deporte}
                  onChange={(e) => setDeporte(e.target.value as FilterDeporte)}
                >
                  <option value="all">Todos los deportes</option>
                  <option value="running">Running</option>
                  <option value="futbol">Futbol</option>
                  <option value="tenis">Tenis</option>
                  <option value="training">Training</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </label>

              <label className="catalog-search">
                <input
                  type="search"
                  placeholder="Buscar modelo o marca"
                  aria-label="Buscar productos"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

              <label className="catalog-sort">
                <select
                  aria-label="Ordenar productos"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOrder)}
                >
                  <option value="default">Ordenar</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name-asc">A-Z</option>
                </select>
              </label>
            </div>

            <p className="catalog-note">
              Mostrando {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Grid de productos */}
          <div className="products-viewport">
            <div className="products-grid">
              {filtered.length > 0 ? (
                filtered.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <p style={{ padding: "2rem", color: "var(--text-soft)" }}>
                  No se encontraron productos con esos filtros.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartPanel />
    </>
  );
}
