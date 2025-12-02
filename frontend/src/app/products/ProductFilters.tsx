import type { CategoryObj } from '../types/product';

interface ProductFiltersProps {
  categories: CategoryObj[];
  onFilter: (category: CategoryObj) => void;
}

export function ProductFilters({ categories, onFilter }: ProductFiltersProps) {
  return (
    <div className="flex gap-2 mb-4">
      {categories.map(cat => (
        <button
          key={cat.id_product_category}
          onClick={() => onFilter(cat)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          {cat.element}
        </button>
      ))}
    </div>
  );
}