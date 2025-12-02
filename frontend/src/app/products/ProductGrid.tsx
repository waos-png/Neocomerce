import * as React from "react";
import Link from "next/link";

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

export function ProductGrid({ products, onProductPreview, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center 
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-500"
          >
            {/* Imagen */}
            {(prod.image_url || prod.image) && (
              <img
                src={prod.image_url || prod.image}
                alt={prod.product_name || prod.name}
                className="h-32 w-full object-contain mb-4 rounded"
                onError={e => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "/images/image-not-found.png";
                }}
              />
            )}
            {/* Título de producto */}
            <h4 className="text-lg font-bold text-fuchsia-700 mb-1">
              {prod.product_name || prod.name}
            </h4>
            <p className="text-sm text-gray-700">{prod.description}</p>
            {/* Rating con estrellas */}
            {typeof prod.rating === "number" && (
              <div className="flex items-center mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={`star-${prod.id}-${i}`}
                    className={i < Math.round(prod.rating as number) ? "text-orange-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">{prod.rating.toFixed(1)}</span>
              </div>
            )}
            {/* Chips de categorías */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(prod.categories) && prod.categories.length > 0
                ? prod.categories.flatMap((cat, cidx) =>
                    [cat.element, cat.type, cat.clasification]
                      .filter((val): val is string => Boolean(val))
                      .map((tech, tidx) => (
                        <span
                          key={`cat-${prod.id}-${cat.id_product_category ?? cidx}-${tidx}-${tech}`}
                          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer hover:bg-orange-500 hover:text-white"
                        >
                          {tech}
                        </span>
                      ))
                  )
                : (
                  <span className="bg-background/50 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer hover:bg-fuchsia-500 hover:text-white">
                    {prod.category || "Sin categoría"}
                  </span>
                )
              }
            </div>
            {/* Botón Ver más */}
            {onProductPreview && (
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded transition-colors duration-200 font-semibold"
                  onClick={() => onProductPreview(prod)}
                >
                  Ver más
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}