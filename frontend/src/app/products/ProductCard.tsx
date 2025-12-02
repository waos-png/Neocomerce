import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      <img src={product.image_url} alt={product.product_name} className="h-48 object-contain mb-2" />
      <h3 className="font-semibold text-lg">{product.product_name}</h3>
      <p className="text-gray-500">
        {product.categories?.map(cat => cat.element).join(', ')}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xl font-bold text-green-600">${product.price}</span>
        <span className="text-yellow-500">★ {product.rating ?? 0}</span>
      </div>
    </div>
  );
}