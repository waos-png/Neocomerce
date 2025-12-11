"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCart, addToCart, removeFromCart, emptyCart } from "@/lib/cartService";

// --- Tipos ---
export type CartItem = {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  priceAtAdd: number;
  subtotal: number;
};

export type Producto = {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
};

type CartContextType = {
  carrito: CartItem[];
  agregarAlCarrito: (product_id: number, quantity?: number) => Promise<void>;
  quitarDelCarrito: (id: number) => Promise<void>;
  cargarCarrito: () => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  total: number;
  loading: boolean;
  error: string | null;
};

// --- Contexto ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Hook para consumir el contexto ---
export const useCarrito = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CartProvider");
  }
  return context;
};

// --- Proveedor del contexto ---
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar carrito desde la API
  const cargarCarrito = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCart();
      // El backend devuelve CartResponse con 'items'
      setCarrito(data.items || []);
    } catch (err: any) {
      console.error("Error al cargar el carrito:", err);
      setError(err.message);
      setCarrito([]);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito usando la API
  const agregarAlCarrito = async (product_id: number, quantity: number = 1) => {
    setError(null);
    try {
      await addToCart(product_id, quantity);
      await cargarCarrito();
    } catch (err: any) {
      const errMsg = err.message || "Error al agregar al carrito";
      setError(errMsg);
      throw err;
    }
  };

  // Quitar producto del carrito usando la API
  const quitarDelCarrito = async (id: number) => {
    setError(null);
    try {
      await removeFromCart(id);
      await cargarCarrito();
    } catch (err: any) {
      const errMsg = err.message || "Error al quitar del carrito";
      setError(errMsg);
      throw err;
    }
  };

  // Vaciar carrito usando la API
  const vaciarCarrito = async () => {
    setError(null);
    try {
      await emptyCart();
      setCarrito([]);
    } catch (err: any) {
      const errMsg = err.message || "Error al vaciar el carrito";
      setError(errMsg);
      throw err;
    }
  };

  // Calcular total
  useEffect(() => {
    const t = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(t);
  }, [carrito]);

  // Cargar el carrito al montar el provider (solo si hay usuario)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      cargarCarrito();
    }
  }, []);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, quitarDelCarrito, cargarCarrito, vaciarCarrito, total, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};
