import { Product } from '../types/product';
import { IconStar, IconShoppingCart, IconCheck } from '@tabler/icons-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const stock = product.stock ?? 0;
  const stockStatus = stock > 0;
  const rating = product.rating ?? 0;
  const roundedRating = Math.round(rating);
  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      
      {/* Imagen Container */}
      <div className="relative w-full h-56 bg-gradient-to-br from-red-50 via-white to-red-50 overflow-hidden">
        <img
          src={product.image_url || "/images/image-not-found.png"}
          alt={product.product_name || "Producto"}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = "/images/image-not-found.png";
          }}
        />
        
        {/* Badge Stock */}
        <div className={`absolute top-3 right-3 ${stockStatus ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"} px-3 py-1.5 rounded-full border-2 flex items-center gap-1.5`}>
          <div className={`w-2 h-2 rounded-full ${stockStatus ? "bg-green-600" : "bg-red-600"}`}></div>
          <span className={`text-xs font-bold ${stockStatus ? "text-green-700" : "text-red-700"}`}>
            {stockStatus ? "Stock" : "Agotado"}
          </span>
        </div>

        {/* Overlay hover con botones */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={onViewDetails}
            className="w-full bg-white text-[#C73838] font-bold py-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Nombre */}
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 h-14 flex items-start">
          {product.product_name || "Producto sin nombre"}
        </h3>

        {/* Categorías */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 line-clamp-1">
            {product.categories && product.categories.length > 0
              ? product.categories.map(cat => cat.element || cat.type).filter(Boolean).join(' • ')
              : "Sin categoría"}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar
                key={i}
                size={16}
                className={i < roundedRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-700">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Separador */}
        <div className="w-full h-px bg-gray-200 mb-3"></div>

        {/* Precio */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 mb-3">
          <p className="text-xs text-gray-600 font-semibold mb-1">Precio</p>
          <p className="text-2xl font-black text-green-600">
            ${price}
          </p>
        </div>

        {/* Botón Agregar */}
        <button
          onClick={onAddToCart}
          disabled={!stockStatus}
          className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            stockStatus
              ? "bg-gradient-to-r from-[#C73838] to-[#B11212] hover:from-[#B11212] hover:to-[#8f0e0e] text-white shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
          }`}
        >
          {stockStatus ? (
            <>
              <IconShoppingCart size={18} stroke={2.5} />
              <span className="text-sm">Agregar</span>
            </>
          ) : (
            <>
              <IconCheck size={18} stroke={2.5} />
              <span className="text-sm">Agotado</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}