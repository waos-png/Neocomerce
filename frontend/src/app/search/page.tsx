'use client';

import { ProductDetailModal } from '@/app/products/ProductDetailModal';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  category?: string;
  price?: number;
  image?: string;
  [key: string]: any;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  // Lee filtros dinámicamente (ej: filter_brand, filter_price_range, etc)
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter_')) {
      filters[key.replace('filter_', '')] = value;
    }
  });

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    // Construye la URL con filtros y categoría
    const params = new URLSearchParams();
    params.append('search', query);
    if (category) params.append('category', category);
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, value);
    });

    fetch(`https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/products/public/?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al buscar productos');
        return res.json();
      })
      .then(data => setResults(data.results || data || []))
      .catch(() => setError('No se pudo obtener resultados.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, ...Object.values(filters)]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 mt-24">
      {/* Botón volver al inicio */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-800 font-semibold transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        Volver al inicio
      </button>
      <h1 className="text-3xl font-extrabold mb-6 text-fuchsia-700 flex items-center gap-2">
        Resultados para: 
        <span className="text-fuchsia-500">{query}</span>
        {category && (
          <span className="ml-2 text-orange-500 text-lg font-semibold">({category})</span>
        )}
      </h1>
      {/* Filtros activos */}
      {Object.keys(filters).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <span key={key} className="inline-flex items-center bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-full text-xs font-medium">
              {key}: {value}
            </span>
          ))}
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-fuchsia-400 mb-6">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-fuchsia-400"></span>
          Buscando...
        </div>
      )}
      {error && <div className="text-red-500 mb-6">{error}</div>}
      {!loading && !error && results.length === 0 && (
        <div className="text-gray-500 text-center py-12">No se encontraron productos.</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {results.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center 
              transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-500"
          >
            {/* Imagen */}
            <div className="w-full flex items-center justify-center mb-4">
              {(product.image_url || product.image) && (
                <img
                  src={product.image_url || product.image}
                  alt={product.name}
                  className="h-32 w-full object-contain mb-4 rounded bg-gray-50"
                  onError={e => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.style.display = "none";
                  }}
                />
              )}
            </div>
            {/* Título de producto */}
            <h4 className="text-lg font-bold text-fuchsia-700 mb-1">
              {product.name}
            </h4>
            {/* Descripción si existe */}
            {product.description && (
              <p className="text-sm text-gray-700">{product.description}</p>
            )}
            {/* Precio */}
            {product.price !== undefined && (
              <span className="text-green-600 font-bold text-xl block mb-2 transition-all duration-700">
                {typeof product.price === "number"
                  ? `€${product.price.toLocaleString()}`
                  : product.price}
              </span>
            )}
            {/* Chips de categorías */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(product.categories) && product.categories.length > 0
                ? product.categories.flatMap((cat, cidx) =>
                    [cat.element, cat.type, cat.clasification]
                      .filter((val): val is string => Boolean(val))
                      .map((tech, tidx) => (
                        <span
                          key={`cat-${product.id}-${cat.id_product_category ?? cidx}-${tidx}-${tech}`}
                          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer hover:bg-orange-500 hover:text-white"
                        >
                          {tech}
                        </span>
                      ))
                  )
                : (
                  <span className="bg-background/50 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer hover:bg-fuchsia-500 hover:text-white">
                    {product.category || "Sin categoría"}
                  </span>
                )
              }
            </div>
            {/* Botón */}
            <div className="flex gap-2 mt-4 w-full">
              <button
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded transition-colors duration-200 font-semibold w-full"
                onClick={() => setSelectedProduct(product)}
              >
                Ver producto
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal de detalle */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}