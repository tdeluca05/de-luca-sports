-- ============================================================
-- SCHEMA — De Luca Sport
-- Ejecutar en: supabase.com > tu proyecto > SQL Editor
-- ============================================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id          SERIAL PRIMARY KEY,
  marca       TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  precio      INTEGER NOT NULL,                 -- en centavos enteros (ej: 80000 = $80.000)
  deporte     TEXT NOT NULL DEFAULT 'running',
  tag         TEXT NOT NULL DEFAULT '',
  badge       TEXT NOT NULL DEFAULT '',
  imagenes    JSONB NOT NULL DEFAULT '[]',      -- array de rutas: ["/img/p1.jpg"]
  talles      JSONB NOT NULL DEFAULT '[]',      -- array de números: [38, 39, 40]
  talles_nota TEXT NOT NULL DEFAULT '',
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nombre    TEXT NOT NULL,
  cliente_email     TEXT NOT NULL,
  cliente_telefono  TEXT NOT NULL DEFAULT '',
  entrega           TEXT NOT NULL,              -- "retiro" | "envio"
  pago              TEXT NOT NULL,              -- "tarjeta" | "transferencia" | "efectivo_local" | "mercadopago"
  direccion         TEXT NOT NULL DEFAULT '',
  items             JSONB NOT NULL,             -- array de CartItem
  total             INTEGER NOT NULL,
  estado            TEXT NOT NULL DEFAULT 'pendiente', -- "pendiente" | "pagado" | "cancelado"
  mp_preference_id  TEXT,
  mp_payment_id     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de suscriptores al newsletter
CREATE TABLE IF NOT EXISTS suscriptores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_productos_marca    ON productos(marca);
CREATE INDEX IF NOT EXISTS idx_productos_deporte  ON productos(deporte);
CREATE INDEX IF NOT EXISTS idx_productos_activo   ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado     ON ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_email      ON ordenes(cliente_email);

-- Row Level Security (RLS)
-- Productos: lectura pública, escritura solo autenticados
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Productos visibles para todos" ON productos;
DROP POLICY IF EXISTS "Solo admin puede modificar productos" ON productos;

CREATE POLICY "Productos visibles para todos"
  ON productos FOR SELECT
  USING (activo = TRUE);

CREATE POLICY "Solo admin puede modificar productos"
  ON productos FOR ALL
  USING (auth.role() = 'authenticated');

-- Órdenes: escritura pública (para crear órdenes sin login), lectura solo autenticados
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cualquiera puede crear una orden" ON ordenes;
DROP POLICY IF EXISTS "Solo admin puede ver las ordenes" ON ordenes;
DROP POLICY IF EXISTS "Solo admin puede actualizar ordenes" ON ordenes;

CREATE POLICY "Cualquiera puede crear una orden"
  ON ordenes FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Solo admin puede ver las ordenes"
  ON ordenes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar ordenes"
  ON ordenes FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Suscriptores: lista privada. Sin políticas públicas, solo accesible
-- vía la API con la service role key (que ignora RLS).
ALTER TABLE suscriptores ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DATOS INICIALES (opcional — podés cargarlos desde el admin)
-- ============================================================

INSERT INTO productos (marca, nombre, descripcion, precio, deporte, tag, badge, imagenes, talles, talles_nota)
SELECT marca, nombre, descripcion, precio::int, deporte, tag, badge, imagenes::jsonb, talles::jsonb, talles_nota
FROM (VALUES
('reebook', 'Energen Run 3', 'Modelo comodo para uso diario, caminatas activas y entrenamiento suave.', '80000', 'running', 'Amortiguacion diaria', 'Running', '["/img/producto1,1.jpeg","/img/producto1,2.jpeg","/img/producto1,3.jpeg"]', '[38.5,39.5,40,41,41.5,42,43,45,45.5]', ''),
('reebook', 'Energen Lite JP', 'Una opcion agil y versatil para quienes buscan comodidad sin exceso de peso.', '65000', 'running', 'Liviana', 'Running', '["/img/producto2,1.jpeg","/img/producto2,2.jpeg"]', '[35,36,37,39,40,41,42,43,44]', ''),
('olympikus', 'Plaza Running', 'Diseno noble y estable para quienes priorizan comodidad y apoyo parejo.', '80000', 'running', 'Uso diario', 'Respuesta suave', '["/img/producto3,1.jpeg","/img/producto3,2.jpeg"]', '[36,37,38,39,40,41]', ''),
('topper', 'Wind 5 Running', 'Una silueta deportiva, firme y rendidora para ritmo cotidiano.', '79000', 'running', 'Rendimiento urbano', 'Precio fuerte', '["/img/producto4,1.jpeg","/img/producto4,2.jpeg","/img/producto4,3.jpeg"]', '[38,39,40,41,42,43,44,45]', ''),
('topper', 'Suva', 'Excelente opcion para arrancar con un modelo funcional y rendidor.', '60000', 'running', 'Precio accesible', 'Entrada ideal', '["/img/producto5,1.jpeg"]', '[37,38,39,40,41,42,43,44,45,46]', ''),
('atomik', 'Fairfaxx', 'Modelo liviano con pocas unidades disponibles en cada talle.', '65000', 'running', 'Stock limitado', 'Ultimas unidades', '["/img/producto6,1.jpeg","/img/producto6,2.jpeg","/img/producto6,3.jpeg","/img/producto6,4.jpeg"]', '[35,36,39,41,42,43,44,45]', '(1 unidad c/u)')
) AS v(marca, nombre, descripcion, precio, deporte, tag, badge, imagenes, talles, talles_nota)
WHERE NOT EXISTS (SELECT 1 FROM productos LIMIT 1);
