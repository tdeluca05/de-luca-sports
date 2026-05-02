"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { CartItem } from "@/lib/types";

// --- Estado y acciones ---

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; cartId: string }
  | { type: "CHANGE_QTY"; cartId: string; delta: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "LOAD"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return { ...state, items: action.items };

    case "ADD": {
      const existing = state.items.find((i) => i.cartId === action.item.cartId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.cartId === action.item.cartId ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };

    case "CHANGE_QTY": {
      const updated = state.items
        .map((i) =>
          i.cartId === action.cartId ? { ...i, qty: i.qty + action.delta } : i
        )
        .filter((i) => i.qty > 0);
      return { ...state, items: updated };
    }

    case "CLEAR":
      return { ...state, items: [] };

    case "OPEN":
      return { ...state, isOpen: true };

    case "CLOSE":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// --- Contexto ---

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  count: number;
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  changeQty: (cartId: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "deluca-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "LOAD", items: JSON.parse(stored) });
    } catch {
      // localStorage no disponible o JSON inválido
    }
  }, []);

  // Persistir en localStorage cuando cambian los items
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const total = state.items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const count = state.items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        total,
        count,
        addItem: (item) => dispatch({ type: "ADD", item }),
        removeItem: (cartId) => dispatch({ type: "REMOVE", cartId }),
        changeQty: (cartId, delta) => dispatch({ type: "CHANGE_QTY", cartId, delta }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        openCart: () => dispatch({ type: "OPEN" }),
        closeCart: () => dispatch({ type: "CLOSE" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
