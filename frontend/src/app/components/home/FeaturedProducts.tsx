"use client";

import { useState } from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useProducts } from "@/app/hooks/useProducts";
import { ProductDetailModal } from "@/app/products/ProductDetailModal";
import type { Product } from "@/app/types/product";

const FeaturedProducts = () => {
  const { products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section>
      <h3 className="inline-block text-2xl font-bold mb-6 text-[#C73838] border-l-4 border-[#e8710fff] pl-3 bg-gradient-to-r from-red-100 to-white rounded px-4 py-1">
        Productos destacados
      </h3>

      {isLoading ? (
        <div className="text-center text-red-500 py-10">Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center 
              transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-red-500"
            >
              {prod.image_url && (
                <img src={prod.image_url} alt={prod.product_name} className="h-32 w-full object-contain mb-4 rounded" />
              )}

              <h4 className="text-lg font-bold text-[#ff4141] mb-1">{prod.product_name}</h4>
              <p className="text-sm text-gray-700">{prod.description}</p>

              <span className="text-green-600 font-bold text-xl block mb-2">
                {typeof prod.price === "number" ? `$${prod.price.toLocaleString()}` : ""}
              </span>

              {typeof prod.rating === "number" && (
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={ i < Math.round(prod.rating ?? 0) ? "text-orange-400" : "text-gray-300" }>★</span>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{prod.rating.toFixed(1)}</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  className="text-orange-500 flex items-center"
                  onClick={() =>
                    Swal.fire({
                        icon: "success",
                        title: "Producto agregado",
                        text: prod.product_name,
                        toast: true,
                        position: "top-end",
                        timer: 1800,
                        showConfirmButton: false,
                    })
                  }
                >
                  <IconShoppingCart size={24} />
                </button>

                <button
                  className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-2 rounded font-semibold"
                  onClick={() => setSelectedProduct(prod)}
                >
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={{ ...selectedProduct, id: String(selectedProduct.id) }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;
