import { useState } from 'react';
import { Product } from '../types/product';
import { ProductGrid } from './ProductGrid';
import { ProductSkeleton } from './ProductSkeleton';
import { ProductDetailModal } from './ProductDetailModal';

/**
 * Interface para categorías de productos
 */
interface CategoryObj {
  element?: string;
  type?: string;
  clasification?: string;
}

/**
 * Interface unificada para productos (acepta ambos formatos)
 */
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
}

/**
 * Props para el componente ProductsView
 */
interface ProductsViewProps {
  products: ProductOrHock[] | undefined;
  isLoading?: boolean;
  title?: string;
}

/**
 * Componente ProductsView
 * Muestra una grilla de productos con carga esquelética
 * Permite previsualizaciones de productos individuales
 * 
 * @param products - Array de productos a mostrar
 * @param isLoading - Estado de carga
 * @param title - Título personalizado de la sección
 */
export function ProductsView({ 
  products, 
  isLoading = false, 
  title = "Productos" 
}: ProductsViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductOrHock | null>(null);

  /**
   * Maneja la previsualización de un producto
   */
  const handleProductPreview = (product: ProductOrHock) => {
    setSelectedProduct(product);
  };

  /**
   * Cierra el modal de detalle del producto
   */
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="w-full max-w-7xl px-4 py-12 mx-auto">
      {/* Título */}
      <h1 className="text-4xl font-bold text-center text-[#C73838] mb-2">
        {title}
      </h1>
      
      {/* Línea decorativa */}
      <div className="flex justify-center mb-10">
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#C73838] to-transparent rounded-full"></div>
      </div>

      {/* Contenido principal */}
      {isLoading ? (
        // Skeleton Loading
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        // Grilla de productos
        <ProductGrid 
          products={products} 
          onProductPreview={handleProductPreview} 
        />
      ) : (
        // Sin productos
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No hay productos disponibles</p>
        </div>
      )}

      {/* Modal de detalles del producto */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}