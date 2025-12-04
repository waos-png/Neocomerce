"use client";

import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { ProductsView } from './ProductsView';
import { IconInfinity } from '@tabler/icons-react';

export default function InfiniteProductsPage() {
  const { products, isLoading, loadMore } = useInfiniteProducts();

  const formattedProducts = (products || []).map((product: any) => ({
    ...product,
    id: String(product?.id || ''),
  }));

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-12">
      
      {/* Header Principal */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <IconInfinity size={32} className="text-blue-600" stroke={2.5} />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
                Catálogo Infinito
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="font-bold text-lg text-blue-600">{formattedProducts.length}</span>
                <span>productos cargados • Desplázate para ver más</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lista de productos */}
        {formattedProducts.length > 0 && (
          <div className="mb-16">
            <ProductsView 
              products={formattedProducts}
              isLoading={isLoading} 
            />
          </div>
        )}

        {/* Estado de carga inicial */}
        {isLoading && formattedProducts.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">Cargando productos</h3>
              <p className="text-gray-500 text-sm">Preparando el catálogo infinito...</p>
            </div>
          </div>
        )}

        {/* Sin productos */}
        {!isLoading && formattedProducts.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                <IconInfinity size={40} className="text-gray-400" stroke={1.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                Sin productos disponibles
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-base">
                Por el momento no hay productos en el catálogo infinito. Vuelve pronto.
              </p>
            </div>
          </div>
        )}

        {/* Indicador de carga más */}
        {isLoading && formattedProducts.length > 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-semibold">Cargando más productos...</p>
            </div>
          </div>
        )}

        {/* Botón cargar más */}
        {!isLoading && formattedProducts.length > 0 && (
          <div className="flex items-center justify-center py-12 mb-12">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
            >
              <IconInfinity size={20} stroke={2.5} />
              Cargar más productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}