"use client";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useProductDetail } from '../../hooks/useProductDetail';
import { ProductSkeleton } from '../ProductSkeleton';
import { IconArrowLeft, IconShoppingCart, IconStar, IconAlertCircle } from '@tabler/icons-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const safeId = typeof id === "string" || typeof id === "number" ? id : "";
  const { product, isLoading } = useProductDetail(safeId);

  if (isLoading) return <ProductSkeleton />;
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center pt-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconAlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no está disponible.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <IconArrowLeft size={20} />
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // Validación de stock
  const stock = product.stock ?? 0;
  const stockStatus = stock > 0 ? "En stock" : "Agotado";
  const stockColor = stock > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botón Volver */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors group"
        >
          <IconArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver atrás
        </button>

        {/* Contenedor Principal */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            
            {/* Imagen del producto */}
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <img 
                src={product.image_url} 
                alt={product.product_name} 
                className="w-full h-96 object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>

            {/* Información del producto */}
            <div className="flex flex-col justify-between">
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
                  {product.product_name}
                </h1>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar
                      key={i}
                      size={20}
                      className={i < Math.round(product.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-semibold">({product.rating ?? 0}/5)</span>
              </div>

              {/* Precio */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <span className="text-6xl font-black text-red-600">
                  ${product.price?.toLocaleString('es-ES') || '0'}
                </span>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories?.map((cat, idx) => (
                    <span 
                      key={idx}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {cat.element}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6 p-4 rounded-lg border-2 border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Disponibilidad</h3>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold px-3 py-1 rounded-full ${stockColor}`}>
                    {stockStatus}
                  </span>
                  <span className="text-gray-600">
                    {stock} unidades disponibles
                  </span>
                </div>
              </div>

              {/* Botón Agregar al carrito */}
              <button
                disabled={stock === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  stock > 0
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <IconShoppingCart size={24} stroke={2.5} />
                {stock > 0 ? 'Agregar al carrito' : 'Producto agotado'}
              </button>
            </div>
          </div>
        </div>

        {/* Espaciado inferior */}
        <div className="h-12" />
      </div>
    </div>
  );
}