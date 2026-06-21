// ============================================================
// TIPOS GLOBALES — De Luca Sport
// ============================================================

export interface Producto {
  id: number;
  marca: string;
  nombre: string;
  descripcion: string;
  precio: number;
  deporte: string;
  tag: string;
  badge: string;
  imagenes: string[];
  talles: number[];
  tallesNota: string;
  colores?: Array<{ nombre: string; hex: string }>;
  activo?: boolean;
}

export interface CartItem {
  cartId: string;       // "{productId}-{talle}"
  productId: number;
  name: string;
  price: number;
  size: number | string;
  qty: number;
}

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  delivery: "retiro" | "envio";
  payment: "tarjeta" | "transferencia" | "efectivo_local" | "mercadopago";
  address: string;
}

export interface Order {
  id?: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  entrega: string;
  pago: string;
  direccion: string;
  items: CartItem[];
  total: number;
  estado: "pendiente" | "pagado" | "cancelado";
  mp_preference_id?: string;
  mp_payment_id?: string;
  created_at?: string;
}
