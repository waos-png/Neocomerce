"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';
import { NavbarDemo } from '../components/ui/NavbarDemo';
import { ProductDetail } from './ProductDetail';
import { Product } from '../types/product';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id]);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center pt-24">
        <div className="text-center">
          <IconLoader2 size={48} className="text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center pt-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">{error || 'El producto que buscas no está disponible.'}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <IconArrowLeft size={20} />
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NavbarDemo />
      </div>
      
      <div className="pt-24 flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
          
          {/* Botón Volver */}
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors group"
            aria-label="Volver"
          >
            <IconArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver atrás
          </button>

          {/* Contenedor del detalle */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <ProductDetail product={product} />
          </div>

          {/* Espaciado inferior */}
          <div className="h-12" />
        </div>
      </div>
    </>
  );
}
