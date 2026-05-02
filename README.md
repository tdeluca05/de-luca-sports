# De Luca Sport — Catálogo Digital

Tienda online de zapatillas deportivas con catálogo, carrito y checkout.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend (v1) | HTML, CSS, JavaScript vanilla |
| Frontend (v2) | Next.js 15, React 18, TypeScript |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Pagos | Mercado Pago SDK (sandbox) |
| Deploy | Vercel |
| CI/CD | GitHub Actions |

## Estructura del proyecto

```
pw/
├── index.html          # Landing page (versión vanilla)
├── catalogo.html       # Catálogo (versión vanilla)
├── productos.js        # Datos de productos (fuente de verdad local)
├── script.js           # Lógica JS: carrito, filtros, galería
├── styles.css          # Sistema de diseño completo
├── img/                # Imágenes de productos y logo
├── next-app/           # Versión full stack (Next.js)
│   ├── app/            # App Router de Next.js
│   ├── components/     # Componentes React reutilizables
│   ├── lib/            # Clientes: Supabase, Mercado Pago
│   └── supabase/       # Schema SQL para la base de datos
└── .github/
    └── workflows/
        └── ci.yml      # Pipeline de CI/CD
```

## Cómo correr el proyecto

### Versión vanilla (sin instalación)
Abrí `index.html` en el navegador directamente.

### Versión Next.js

```bash
cd next-app
npm install
cp .env.local.example .env.local
# Completá las variables en .env.local
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Crear `next-app/.env.local` a partir de `.env.local.example`:

```env
# Supabase — obtenelas en supabase.com > tu proyecto > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mercado Pago — obtenelas en developers.mercadopago.com
MP_ACCESS_TOKEN=APP_USR-xxxx
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxx

# URL del sitio (en producción, la URL de Vercel)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Base de datos

1. Creá un proyecto en [supabase.com](https://supabase.com)
2. Abrí el **SQL Editor**
3. Pegá y ejecutá el contenido de `next-app/supabase/schema.sql`
4. Completá las variables de entorno con la URL y clave de tu proyecto

## Deploy en Vercel

1. Push del repo a GitHub
2. Conectar repo en [vercel.com](https://vercel.com)
3. **Root Directory:** `next-app`
4. Agregar las variables de entorno en Vercel > Settings > Environment Variables

## Funcionalidades implementadas

- [x] Catálogo con filtros por marca y deporte
- [x] Galería de imágenes por producto
- [x] Selección de talle
- [x] Carrito persistente (localStorage)
- [x] Formulario de checkout con validación
- [x] Envío de pedido por WhatsApp
- [x] Newsletter con confirmación
- [x] API REST: GET/POST productos, POST órdenes
- [x] Checkout con Mercado Pago sandbox
- [x] Webhook para confirmar pagos
- [x] Panel admin (CRUD de productos) — requiere auth
- [ ] Tests automatizados
- [ ] Auth completo con roles

## Cronograma académico

| Semana | Tema | Estado |
|---|---|---|
| 1 | Fundamentos web | ✅ |
| 2 | GitHub y control de versiones | ✅ |
| 3 | CI/CD básico | ✅ |
| 4 | HTML semántico y accesibilidad | ✅ |
| 5 | CSS responsive | ✅ |
| 6 | JavaScript moderno | ✅ |
| 7 | DOM, eventos, validación, localStorage | ✅ |
| 8 | React | ✅ |
| 9 | Next.js | ✅ |
| 10 | API interna | ✅ |
| 11 | Supabase | ✅ |
| 12 | Autenticación y CRUD | ✅ |
| 13 | Catálogo, carrito y órdenes | ✅ |
| 14 | Mercado Pago sandbox | ✅ |
| 15 | Webhooks | ✅ |
| 16 | Documentación, testing, demo | 🔄 |
