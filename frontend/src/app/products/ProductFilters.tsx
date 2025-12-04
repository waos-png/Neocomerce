import { useState } from 'react';
import { IconFilter, IconX } from '@tabler/icons-react';
import type { CategoryObj } from '../types/product';

interface ProductFiltersProps {
  categories: CategoryObj[];
  onFilter: (category: CategoryObj | null) => void;
}

/**
 * Componente ProductFilters
 * Muestra filtros de categorías para productos
 * Permite seleccionar una categoría o limpiar los filtros
 * 
 * @param categories - Array de categorías disponibles
 * @param onFilter - Callback cuando se selecciona un filtro
 */
export function ProductFilters({ categories, onFilter }: ProductFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  /**
   * Maneja el click en un filtro de categoría
   */
  const handleFilterClick = (category: CategoryObj) => {
    const isActive = activeFilter === category.id_product_category?.toString();
    
    if (isActive) {
      setActiveFilter(null);
      onFilter(null);
    } else {
      setActiveFilter(category.id_product_category?.toString() || null);
      onFilter(category);
    }
  };

  /**
   * Limpia todos los filtros activos
   */
  const handleClearFilters = () => {
    setActiveFilter(null);
    onFilter(null);
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconFilter size={20} className="text-[#C73838]" />
          <h3 className="text-lg font-bold text-gray-900">
            Filtrar por categoría
          </h3>
        </div>
        {activeFilter && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-[#C73838] hover:text-[#B11212] transition-colors"
          >
            <IconX size={16} />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          const isActive = activeFilter === cat.id_product_category?.toString();
          
          return (
            <button
              key={cat.id_product_category}
              onClick={() => handleFilterClick(cat)}
              className={`
                px-4 py-2.5 rounded-lg font-semibold text-sm
                transition-all duration-200 ease-out
                ${isActive
                  ? 'bg-gradient-to-r from-[#C73838] to-[#B11212] text-white shadow-lg scale-105'
                  : 'bg-red-50 text-[#C73838] border-2 border-red-100 hover:border-[#C73838] hover:bg-red-100'
                }
              `}
            >
              {cat.element || cat.type || 'Sin categoría'}
            </button>
          );
        })}
      </div>

      {/* Línea decorativa */}
      <div className="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent mt-6"></div>
    </div>
  );
}