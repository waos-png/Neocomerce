'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Categoria {
  element: string;
  type: string;
  clasification: string;
}

interface Producto {
  categoria: Categoria;
  nombre: string;
  descripcion: string;
  estado: 'nuevo' | 'usado' | '';
  precio: string;
  stock: string;
  garantia: string;
  imagenUrl: string;
}

interface ProductoContextType {
  producto: Producto;
  setProducto: (producto: Partial<Producto>) => void;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

export function ProductoProvider({ children }: { children: ReactNode }) {
  const [producto, setProductoState] = useState<Producto>({
    categoria: { element: '', type: '', clasification: '' },
    nombre: '',
    descripcion: '',
    estado: '',
    precio: '',
    stock: '',
    garantia: '',
    imagenUrl: '',
  });

  const setProducto = (updates: Partial<Producto>) => {
    setProductoState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ProductoContext.Provider value={{ producto, setProducto }}>
      {children}
    </ProductoContext.Provider>
  );
}

export function useProducto() {
  const context = useContext(ProductoContext);
  if (!context) throw new Error('useProducto debe usarse dentro de ProductoProvider');
  return context;
}
