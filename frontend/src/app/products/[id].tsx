"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavbarDemo } from '../components/ui/NavbarDemo';
import { ProductDetail } from './ProductDetail';
import { Product } from '../types/product';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="pt-24 text-center">Cargando...</div>;
  }

  if (!product) {
    return <div className="pt-24 text-center">No encontrado</div>;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NavbarDemo />
      </div>
      <div className="pt-24 flex flex-col items-center w-full min-h-screen bg-gray-50">
        <div className="max-w-3xl w-full px-4">
          <button
            className="mb-4 text-fuchsia-700 font-semibold hover:underline"
            onClick={() => router.back()}
            aria-label="Volver"
          >
            ← Volver
          </button>
          <ProductDetail product={product} />
        </div>
      </div>
    </>
  );
}
