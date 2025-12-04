import * as React from "react";
import Link from "next/link";
import { IconShoppingCart, IconEye } from "@tabler/icons-react";

interface CategoryObj {
  id_product_category?: number;
  element?: string;
  type?: string;
  clasification?: string;
}

interface ProductOrHock {
  id: string;
  product_name?: string;
  name?: string;
  description?: string;
  price?: number | string;
  image_url?: string;
  image?: string;
  categories?: CategoryObj[];
  category?: string;
  rating?: number;
}

interface ProductGridProps {
  products: ProductOrHock[];
  onProductPreview?: (product: ProductOrHock) => void;
  isLoading?: boolean;
}

/**
 * Componente ProductGrid
 * Muestra una grilla de tarjetas de productos con imagen, descripción, rating y categorías
 * 
 * @param products - Array de productos a mostrar
 * @param onProductPreview - Callback para previsualizar un producto
 * @param isLoading - Estado de carga
 */
export function ProductGrid({ products, onProductPreview, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">Cargando productos...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400 text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="group bg-white rounded-2xl shadow-md p-5 flex flex-col
                      transition-all duration-300 ease-out
                      hover:shadow-xl hover:scale-105 hover:ring-2 hover:ring-[#C73838]"
          >
            {/* Imagen */}
            <div className="relative mb-4 overflow-hidden rounded-xl bg-red-50 h-48 flex items-center justify-center">
              {(prod.image_url || prod.image) ? (
                <img
                  src={prod.image_url || prod.image}
                  alt={prod.product_name || prod.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={e => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = "/images/image-not-found.png";
                  }}
                />
              ) : (
                <div className="text-gray-300 text-4xl">📦</div>
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1">
              {/* Título */}
              <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#C73838] transition-colors">
                {prod.product_name || prod.name || "Sin nombre"}
              </h4>

              {/* Descripción */}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {prod.description || "Sin descripción disponible"}
              </p>

              {/* Rating con estrellas */}
              {typeof prod.rating === "number" && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={`star-${prod.id}-${i}`}
                        className={`text-sm ${
                          i < Math.round(prod.rating as number)
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {prod.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Chips de categorías */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(prod.categories) && prod.categories.length > 0
                  ? prod.categories
                      .flatMap((cat, cidx) =>
                        [cat.element, cat.type, cat.clasification]
                          .filter((val): val is string => Boolean(val))
                          .map((tech, tidx) => (
                            <span
                              key={`cat-${prod.id}-${cat.id_product_category ?? cidx}-${tidx}-${tech}`}
                              className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold 
                                       transition-all duration-200 cursor-pointer 
                                       hover:bg-blue-100 hover:text-blue-900"
                            >
                              {tech}
                            </span>
                          ))
                      )
                  : (
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold 
                                   transition-all duration-200 cursor-pointer 
                                   hover:bg-slate-200 hover:text-slate-900">
                      {prod.category || "Sin categoría"}
                    </span>
                  )}
              </div>

              {/* Precio */}
              {prod.price && (
                <div className="mb-4">
                  <p className="text-2xl font-black text-green-600">
                    ${typeof prod.price === "string" ? prod.price : prod.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            {onProductPreview && (
              <button
                className="w-full bg-gradient-to-r from-[#C73838] to-[#B11212] hover:from-[#B11212] hover:to-[#8f0e0e] 
                         text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                onClick={() => onProductPreview(prod)}
              >
                <IconEye size={18} />
                Ver detalles
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}