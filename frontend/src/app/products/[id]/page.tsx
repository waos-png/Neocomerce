"use client";
import { useParams } from 'next/navigation';
import { useProductDetail } from '../../hooks/useProductDetail';
import { ProductSkeleton } from '../ProductSkeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const safeId = typeof id === "string" || typeof id === "number" ? id : "";
  const { product, isLoading } = useProductDetail(safeId);

  if (isLoading) return <ProductSkeleton />;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img src={product.image_url} alt={product.product_name} className="w-full h-96 object-contain mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-fuchsia-700">{product.product_name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-2xl font-bold text-fuchsia-700">${product.price}</span>
        <span className="text-yellow-500">★ {product.rating ?? 0}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-fuchsia-700">Categorías: </span>
        {product.categories?.map(cat => cat.element).join(', ')}
      </div>
      <div className="mb-2">
        <span className="font-semibold text-fuchsia-700">Stock: </span>
        {product.stock}
      </div>
    </div>
  );
}