"use client";

import { useEffect, useState } from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useProducts } from "@/app/hooks/useProducts";
import type { Product } from "@/app/types/product";

function useRandomBestSellers(products: Product[]) {
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [fade, setFade] = useState(true);

  const getRandomProducts = (count: number) => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (products.length >= 3) {
      setRandomProducts(getRandomProducts(3));
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setRandomProducts(getRandomProducts(3));
          setFade(true);
        }, 600);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [products]);

  return { randomProducts, fade };
}

const BestSeller = () => {
  const { products } = useProducts();
  const { randomProducts, fade } = useRandomBestSellers(products);

  if (randomProducts.length === 0) return null;

  return (
    <section>
      <h3 className="inline-block text-2xl font-bold mb-6 text-[#C73838] border-l-4 border-[#e8710fff] pl-3 bg-gradient-to-r from-red-100 to-white rounded px-4 py-1">
        Lo más vendido
      </h3>

      <div className="flex justify-center gap-6">
        {randomProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center w-80
            transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-red-500
            ${fade ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            {product.image_url && (
              <img src={product.image_url} alt={product.product_name} className="h-32 w-full object-contain mb-4 rounded" />
            )}

            <h4 className="text-lg font-bold text-[#ff4141] mb-1">{product.product_name}</h4>

            <span className="text-green-600 font-bold text-xl block mb-2">
              {typeof product.price === "number" ? `$${product.price.toLocaleString()}` : ""}
            </span>

            {typeof product.rating === "number" && (
              <div className="flex items-center justify-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={ i < Math.round(product.rating ?? 0) ? "text-orange-400" : "text-gray-300" }>★</span>
                ))}
                <span className="ml-2 text-sm text-gray-600">{product.rating.toFixed(1)}</span>
              </div>
            )}

            <button
              className="text-orange-500 mt-auto flex items-center"
              onClick={() =>
                Swal.fire({
                  icon: "success",
                  title: "Producto agregado",
                  text: product.product_name,
                  toast: true,
                  position: "top-end",
                  timer: 1800,
                  showConfirmButton: false,
                })
              }
            >
              <IconShoppingCart size={24} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
