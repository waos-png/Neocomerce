"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCart, addToCart, removeFromCart, emptyCart } from "@/lib/cartService";

// --- Tipos ---
export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

type CartContextType = {
  carrito: Producto[];
  agregarAlCarrito: (product_id: number, quantity?: number) => Promise<void>;
  quitarDelCarrito: (id: string) => Promise<void>;
  cargarCarrito: () => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  total: number;
  loading: boolean;
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
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Cargar carrito desde la API
  const cargarCarrito = async () => {
    setLoading(true);
    try {
      const data = await fetchCart();
      setCarrito(data.cart || []);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCarrito([]);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito usando la API
  const agregarAlCarrito = async (product_id: number, quantity: number = 1) => {
    try {
      await addToCart(String(product_id), quantity);
      await cargarCarrito();
    } catch (error) {
      throw error;
    }
  };

  // Quitar producto del carrito usando la API
  const quitarDelCarrito = async (id: string) => {
    try {
      await removeFromCart(id);
      await cargarCarrito();
    } catch (error) {
      throw error;
    }
  };

  // Vaciar carrito usando la API
  const vaciarCarrito = async () => {
    try {
      await emptyCart();
      await cargarCarrito();
    } catch (error) {
      throw error;
    }
  };

  // Calcular total
  useEffect(() => {
    const t = carrito.reduce((acc, prod) => acc + prod.precio * (prod.cantidad || 1), 0);
    setTotal(t);
  }, [carrito]);

  // Cargar el carrito al montar el provider
  useEffect(() => {
    cargarCarrito();
  }, []);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, quitarDelCarrito, cargarCarrito, vaciarCarrito, total, loading }}>
      {children}
    </CartContext.Provider>
  );
};
