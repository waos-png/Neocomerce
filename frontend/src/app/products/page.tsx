"use client";

import { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductsView } from "./ProductsView";
import { IconFilter, IconX, IconAdjustmentsHorizontal, IconChevronDown, IconCurrencyDollar, IconStar, IconBox, IconArrowsSort } from "@tabler/icons-react";

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevant");
  const [showFilters, setShowFilters] = useState(false);
  
  const { products, isLoading } = useProducts();

  // Calcular rango de precios dinámicamente
  const priceStats = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 1000,
        ranges: [
          { label: "Menos de $50", value: "under50", min: 0, max: 50 },
          { label: "$50 - $100", value: "50to100", min: 50, max: 100 },
          { label: "$100 - $500", value: "100to500", min: 100, max: 500 },
          { label: "Más de $500", value: "over500", min: 500, max: Infinity },
        ],
      };
    }

    const prices = products.map(p => 
      typeof p.price === 'number' ? p.price : parseFloat(p.price || "0")
    ).filter(p => p > 0);

    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    // Generar rangos dinámicos basados en precios reales
    const rangeSize = (maxPrice - minPrice) / 4;
    
    return {
      minPrice,
      maxPrice,
      ranges: [
        { 
          label: `Menos de $${Math.ceil(minPrice + rangeSize)}`, 
          value: "range1", 
          min: minPrice, 
          max: Math.ceil(minPrice + rangeSize) 
        },
        { 
          label: `$${Math.ceil(minPrice + rangeSize)} - $${Math.ceil(minPrice + rangeSize * 2)}`, 
          value: "range2", 
          min: Math.ceil(minPrice + rangeSize), 
          max: Math.ceil(minPrice + rangeSize * 2) 
        },
        { 
          label: `$${Math.ceil(minPrice + rangeSize * 2)} - $${Math.ceil(minPrice + rangeSize * 3)}`, 
          value: "range3", 
          min: Math.ceil(minPrice + rangeSize * 2), 
          max: Math.ceil(minPrice + rangeSize * 3) 
        },
        { 
          label: `Más de $${Math.ceil(minPrice + rangeSize * 3)}`, 
          value: "range4", 
          min: Math.ceil(minPrice + rangeSize * 3), 
          max: Infinity 
        },
      ],
    };
  }, [products]);

  const handleResetFilters = () => {
    setPriceRange("");
    setRating("");
    setAvailability("");
    setSortBy("relevant");
  };

  const filteredAndSortedProducts = products?.filter((product) => {
    if (priceRange) {
      const price = typeof product.price === 'number' ? product.price : parseFloat(product.price || "0");
      const selectedRange = priceStats.ranges.find(r => r.value === priceRange);
      
      if (selectedRange) {
        if (price < selectedRange.min || price >= selectedRange.max) return false;
      }
    }

    if (rating) {
      const productRating = product.rating ?? 0;
      switch (rating) {
        case "4plus":
          if (productRating < 4) return false;
          break;
        case "3plus":
          if (productRating < 3) return false;
          break;
        case "2plus":
          if (productRating < 2) return false;
          break;
      }
    }

    if (availability) {
      const stock = product.stock ?? 0;
      if (availability === "instock" && stock === 0) return false;
      if (availability === "outofstock" && stock > 0) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price || "0");
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price || "0");
        return priceA - priceB;
      case "priceHigh":
        const priceAH = typeof a.price === 'number' ? a.price : parseFloat(a.price || "0");
        const priceBH = typeof b.price === 'number' ? b.price : parseFloat(b.price || "0");
        return priceBH - priceAH;
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      case "relevant":
      default:
        return 0;
    }
  }) || [];

  const activeFiltersCount = [priceRange, rating, availability].filter(Boolean).length;

  return (
    <div className="w-full min-h-screen pt-18">
      
      {/* Header Principal - NO FIJO */}
      <div className="w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Título y Filtros */}
          <div className="flex items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
                Nuestros Productos
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-[#C73838] to-transparent rounded-full"></div>
                <p className="text-gray-600">
                  <span className="font-bold text-xl text-[#C73838]">{filteredAndSortedProducts.length}</span>
                  <span className="ml-2 text-base">producto{filteredAndSortedProducts.length !== 1 ? "s" : ""} encontrado{filteredAndSortedProducts.length !== 1 ? "s" : ""}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap ${
                showFilters
                  ? "bg-[#C73838] text-white"
                  : "bg-white text-[#C73838] border-2 border-[#C73838] hover:bg-red-50"
              }`}
            >
              <IconAdjustmentsHorizontal size={22} stroke={2.5} />
              <span className="text-base">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className={`ml-1 px-2.5 py-1 rounded-full text-xs font-black ${
                  showFilters
                    ? "bg-white/25"
                    : "bg-[#C73838] text-white"
                }`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filtros expandibles */}
          {showFilters && (
            <div className="pt-8 border-t-2 border-gray-200 animate-in fade-in slide-in-from-up-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Filtro por precio - DINÁMICO */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <IconCurrencyDollar size={18} className="text-blue-600" stroke={2.5} />
                    </div>
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Rango de Precio
                    </label>
                  </div>
                  <select 
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-[#C73838] transition-all appearance-none bg-white font-medium text-gray-800 cursor-pointer hover:border-[#C73838]"
                  >
                    <option value="">Todos los precios</option>
                    {priceStats.ranges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown size={18} className="absolute right-4 top-12 text-gray-400 pointer-events-none" stroke={2.5} />
                </div>

                {/* Filtro por calificación */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <IconStar size={18} className="text-amber-500" stroke={2.5} />
                    </div>
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Calificación
                    </label>
                  </div>
                  <select 
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-[#C73838] transition-all appearance-none bg-white font-medium text-gray-800 cursor-pointer hover:border-[#C73838]"
                  >
                    <option value="">Todas las calificaciones</option>
                    <option value="4plus">4 estrellas o más</option>
                    <option value="3plus">3 estrellas o más</option>
                    <option value="2plus">2 estrellas o más</option>
                  </select>
                  <IconChevronDown size={18} className="absolute right-4 top-12 text-gray-400 pointer-events-none" stroke={2.5} />
                </div>

                {/* Filtro por disponibilidad */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <IconBox size={18} className="text-green-600" stroke={2.5} />
                    </div>
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Disponibilidad
                    </label>
                  </div>
                  <select 
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-[#C73838] transition-all appearance-none bg-white font-medium text-gray-800 cursor-pointer hover:border-[#C73838]"
                  >
                    <option value="">Todos</option>
                    <option value="instock">En stock</option>
                    <option value="outofstock">Agotado</option>
                  </select>
                  <IconChevronDown size={18} className="absolute right-4 top-12 text-gray-400 pointer-events-none" stroke={2.5} />
                </div>

                {/* Ordenar por */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <IconArrowsSort size={18} className="text-purple-600" stroke={2.5} />
                    </div>
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Ordenar por
                    </label>
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-[#C73838] transition-all appearance-none bg-white font-medium text-gray-800 cursor-pointer hover:border-[#C73838]"
                  >
                    <option value="relevant">Más relevante</option>
                    <option value="priceLow">Precio menor</option>
                    <option value="priceHigh">Precio mayor</option>
                    <option value="rating">Mejor calificación</option>
                  </select>
                  <IconChevronDown size={18} className="absolute right-4 top-12 text-gray-400 pointer-events-none" stroke={2.5} />
                </div>
              </div>

              {/* Botón reset filtros */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#C73838] rounded-full"></div>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-[#C73838]">{activeFiltersCount}</span>
                      <span className="ml-1.5">filtro{activeFiltersCount !== 1 ? "s" : ""} activo{activeFiltersCount !== 1 ? "s" : ""}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-2 text-sm font-bold text-[#C73838] hover:text-[#B11212] transition-all duration-200 hover:gap-3"
                  >
                    <IconX size={18} stroke={2.5} />
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Estado de carga */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#C73838] rounded-full animate-spin"></div>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">Cargando productos</h3>
              <p className="text-gray-500 text-sm">Esto puede tomar unos segundos</p>
            </div>
          </div>
        )}

        {/* Sin productos */}
        {!isLoading && filteredAndSortedProducts.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                <IconFilter size={40} className="text-gray-400" stroke={1.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-base">
                {activeFiltersCount > 0
                  ? "No hay productos que coincidan con los filtros seleccionados. Intenta ajustar tus preferencias."
                  : "Por el momento no hay productos disponibles. Vuelve pronto."}
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="bg-gradient-to-r from-[#C73838] to-[#B11212] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                >
                  <IconX size={18} stroke={2.5} />
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Productos */}
        {!isLoading && filteredAndSortedProducts.length > 0 && (
          <div className="animate-in fade-in duration-500">
            <ProductsView
              products={filteredAndSortedProducts.map(product => ({
                ...product,
                id: String(product.id),
              }))}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}