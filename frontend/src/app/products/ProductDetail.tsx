import { Product } from '../types/product';
import { IconShoppingCart, IconStar, IconTruck, IconShield, IconUser, IconTag } from '@tabler/icons-react';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-semibold text-lg">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  const stock = product.stock ?? 0;
  const stockStatus = stock > 0;
  const stockColor = stockStatus ? "text-green-600" : "text-red-600";
  const stockBg = stockStatus ? "bg-green-50" : "bg-red-50";

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Imagen - 2 columnas */}
        <div className="lg:col-span-2">
          <div className="relative w-full bg-gradient-to-br from-red-50 via-white to-red-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <img
              src={product.image_url || "/images/image-not-found.png"}
              alt={product.product_name || "Producto"}
              className="w-full h-96 object-contain hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = "/images/image-not-found.png";
              }}
            />
            {/* Badge Stock */}
            <div className={`absolute top-6 right-6 ${stockBg} px-4 py-2 rounded-full flex items-center gap-2 border-2 ${stockStatus ? "border-green-300" : "border-red-300"}`}>
              <div className={`w-2 h-2 rounded-full ${stockStatus ? "bg-green-600" : "bg-red-600"}`}></div>
              <span className={`text-sm font-bold ${stockColor}`}>
                {stockStatus ? "En stock" : "Sin stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Información principal - 1 columna */}
        <div className="flex flex-col gap-6">
          
          {/* Nombre y Rating */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 leading-tight">
              {product.product_name || "Producto sin nombre"}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar
                    key={i}
                    size={18}
                    className={i < Math.round(product.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">
                {(product.rating ?? 0).toFixed(1)} / 5.0
              </span>
            </div>

            {/* Precio destacado */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
              <p className="text-gray-600 text-xs font-semibold mb-1 uppercase tracking-wide">Precio</p>
              <p className="text-4xl font-black text-green-600">
                ${typeof product.price === "number" ? product.price.toFixed(2) : (product.price ?? "0.00")}
              </p>
            </div>
          </div>

          {/* Stock Info */}
          <div className={`${stockBg} rounded-2xl p-4 border-2 ${stockStatus ? "border-green-200" : "border-red-200"}`}>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">Stock disponible</p>
            <p className={`text-2xl font-black ${stockColor}`}>
              {stock} unidades
            </p>
          </div>

          {/* Botón compra rápida */}
          <button 
            disabled={!stockStatus}
            className={`w-full ${
              stockStatus 
                ? "bg-gradient-to-r from-[#C73838] to-[#B11212] hover:from-[#B11212] hover:to-[#8f0e0e] cursor-pointer" 
                : "bg-gray-400 cursor-not-allowed opacity-60"
            } text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg`}
          >
            <IconShoppingCart size={24} stroke={2} />
            {stockStatus ? "Agregar al carrito" : "Sin stock"}
          </button>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <IconTag size={24} className="text-[#C73838]" stroke={2} />
          Descripción
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {product.description || "Sin descripción disponible"}
        </p>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Categorías */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <IconTag size={20} className="text-blue-600" stroke={2} />
            Categorías
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.categories && product.categories.length > 0 ? (
              product.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  {cat.element || cat.type || "Categoría"}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Sin categorías</span>
            )}
          </div>
        </div>

        {/* Vendedor */}
        {product.seller && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconUser size={20} className="text-purple-600" stroke={2} />
              Vendedor
            </h3>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-purple-900 font-bold text-lg mb-1">{product.seller.name || "Vendedor"}</p>
              {product.seller.email && (
                <p className="text-purple-700 text-sm flex items-center gap-1">
                  <span>📧</span>
                  {product.seller.email}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info de envío y garantía */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <IconTruck size={32} className="text-blue-600" stroke={2} />
          </div>
          <div>
            <p className="font-bold text-gray-900">Envío Gratis</p>
            <p className="text-sm text-gray-600">En compras mayores a $50</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl">
            <IconShield size={32} className="text-green-600" stroke={2} />
          </div>
          <div>
            <p className="font-bold text-gray-900">Garantía 30 días</p>
            <p className="text-sm text-gray-600">Devolución fácil</p>
          </div>
        </div>
      </div>
    </div>
  );
}