import { Product } from '../types/product';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <img
        src={product.image_url}
        alt={product.product_name}
        className="w-full h-96 object-contain mb-4 rounded"
      />
      <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-2xl font-bold text-green-600">${product.price}</span>
        <span className="text-yellow-500">★ {product.rating ?? 0}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Categorías: </span>
        {product.categories?.map(cat => cat.element).join(', ')}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Stock: </span>
        {product.stock}
      </div>
      {product.seller && (
        <div className="mb-2">
          <span className="font-semibold">Vendedor: </span>
          {product.seller.name} {product.seller.email && (<span className="text-gray-500">({product.seller.email})</span>)}
        </div>
      )}
    </div>
  );
}