"use client";

import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductsView } from "./ProductsView";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { products, isLoading } = useProducts(search);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 pt-16">
      {/* Si necesitas un buscador, agrégalo aquí */}
      <ProductsView
        products={products?.map(product => ({
          ...product,
          id: String(product.id),
        }))}
        isLoading={isLoading}
      />
    </div>
  );
}