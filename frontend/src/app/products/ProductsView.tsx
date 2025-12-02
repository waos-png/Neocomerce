import { useState } from 'react';
import { Product } from '../types/product';
import { ProductGrid } from './ProductGrid';
import { ProductSkeleton } from './ProductSkeleton';
import { ProductDetailModal } from './ProductDetailModal'; // Debes crear este componente

interface CategoryObj {
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
  categories?: CategoryObj[]; // <-- Cambia aquí
  category?: string;
}

interface ProductsViewProps {
  products: ProductOrHock[] | undefined;
  isLoading?: boolean;
  title?: string;
}

export function ProductsView({ products, isLoading = false, title = "Productos" }: ProductsViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductOrHock | null>(null);

  const handleProductPreview = (product: ProductOrHock) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="w-full max-w-7xl px-4 py-12 mx-auto">
      <h1 className="text-3xl font-bold text-center text-fuchsia-700 mb-10">{title}</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <ProductGrid products={products || []} onProductPreview={handleProductPreview} />
      )}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}

// En ProductDetailModal.tsx
interface ProductDetailModalProps {
  product: ProductOrHock;
  onClose: () => void;
}