'use client';

import { ProductDetailModal } from '@/app/products/ProductDetailModal';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import API_BASE from '@/lib/apiBase';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconCurrencyDollar,
  IconStar,
  IconBox,
  IconArrowsSort,
  IconFilter,
  IconX
} from '@tabler/icons-react';

interface Product {
  id: string;
  name: string;
  category?: string;
  price?: number | string;
  image?: string;
  image_url?: string;
  description?: string;
  categories?: any[];
  rating?: number;
  stock?: number;
  [key: string]: any;
}

/* -----------------------
   Componente FilterSelect
   Reusable, animado y accesible
   ----------------------- */
type Option<T extends string = string> = { label: string; value: T };

function FilterSelect<T extends string = string>(props: {
  value: T | '';
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  const { value, onChange, options, placeholder } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const selected = options.find(o => o.value === value) ?? null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={placeholder || 'Filtro'}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-left font-medium text-gray-800 hover:border-[#C73838] focus:outline-none focus:ring-2 focus:ring-[#C73838] transition-all"
      >
        {/* Solo mostramos la etiqueta seleccionada (sin título ni icono) */}
        <div className="flex-1 text-sm text-gray-800 truncate">
          {selected ? selected.label : 'Todos'}
        </div>

        <div className="flex items-center gap-2">
          <IconChevronDown className={`transform transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} size={18} />
        </div>
      </button>

      <motion.ul
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.16 }}
        className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        style={{ display: open ? 'block' : 'none' }}
        role="listbox"
        aria-activedescendant={selected ? String(selected.value) : undefined}
      >
        {options.map(opt => (
          <li key={String(opt.value)} role="option" aria-selected={opt.value === value}>
            <button
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-3 hover:bg-red-50 flex items-center justify-between gap-2 transition-colors ${
                opt.value === value ? 'bg-red-50' : 'bg-white'
              }`}
            >
              <span className="text-sm text-gray-800">{opt.label}</span>
              {opt.value === value && (
                <span className="text-red-600 font-bold">✔</span>
              )}
            </button>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

/* -----------------------
   Página SearchPage
   ----------------------- */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  // Lee filtros dinámicamente (ej: filter_brand, filter_price_range, etc)
  const filtersFromParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter_')) {
      filtersFromParams[key.replace('filter_', '')] = value;
    }
  });

  const [rawResults, setRawResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estados de filtros (misma lógica que en products/page.tsx)
  const [priceRange, setPriceRange] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!query) {
      setRawResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    // Construye la URL con filtros y categoría
    const params = new URLSearchParams();
    params.append('q', query);
    if (category) params.append('categoryId', category);
    Object.entries(filtersFromParams).forEach(([key, value]) => {
      params.append(key, value);
    });

    fetch(`${API_BASE}/products?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al buscar productos');
        return res.json();
      })
      .then(data => {
        const backendList = Array.isArray(data) ? data : [];
        const mapped = backendList
          .map((p: any) => mapBackendProduct(p))
          .filter(Boolean) as Product[];
        setRawResults(mapped);
      })
      .catch(() => setError('No se pudo obtener resultados.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, ...Object.values(filtersFromParams)]);

  // Calcular rango de precios dinámicamente a partir de rawResults
  const priceStats = useMemo(() => {
    if (!rawResults || rawResults.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 1000,
        ranges: [
          { label: 'Menos de $50', value: 'under50', min: 0, max: 50 },
          { label: '$50 - $100', value: '50to100', min: 50, max: 100 },
          { label: '$100 - $500', value: '100to500', min: 100, max: 500 },
          { label: 'Más de $500', value: 'over500', min: 500, max: Infinity },
        ],
      };
    }

    const prices = rawResults
      .map(p => (typeof p.price === 'number' ? p.price : parseFloat(p.price || '0')))
      .filter(p => !isNaN(p) && p > 0);

    if (prices.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 1000,
        ranges: [
          { label: 'Menos de $50', value: 'under50', min: 0, max: 50 },
          { label: '$50 - $100', value: '50to100', min: 50, max: 100 },
          { label: '$100 - $500', value: '100to500', min: 100, max: 500 },
          { label: 'Más de $500', value: 'over500', min: 500, max: Infinity },
        ],
      };
    }

    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    const rangeSize = (maxPrice - minPrice) / 4;

    return {
      minPrice,
      maxPrice,
      ranges: [
        {
          label: `Menos de $${Math.ceil(minPrice + rangeSize)}`,
          value: 'range1',
          min: minPrice,
          max: Math.ceil(minPrice + rangeSize),
        },
        {
          label: `$${Math.ceil(minPrice + rangeSize)} - $${Math.ceil(minPrice + rangeSize * 2)}`,
          value: 'range2',
          min: Math.ceil(minPrice + rangeSize),
          max: Math.ceil(minPrice + rangeSize * 2),
        },
        {
          label: `$${Math.ceil(minPrice + rangeSize * 2)} - $${Math.ceil(minPrice + rangeSize * 3)}`,
          value: 'range3',
          min: Math.ceil(minPrice + rangeSize * 2),
          max: Math.ceil(minPrice + rangeSize * 3),
        },
        {
          label: `Más de $${Math.ceil(minPrice + rangeSize * 3)}`,
          value: 'range4',
          min: Math.ceil(minPrice + rangeSize * 3),
          max: Infinity,
        },
      ],
    };
  }, [rawResults]);

  // Filtrar y ordenar resultados en cliente (misma lógica que en products)
  const filteredAndSortedResults = (rawResults || []).filter((product) => {
    if (priceRange) {
      const price = typeof product.price === 'number' ? product.price : parseFloat(product.price || '0');
      const selectedRange = priceStats.ranges.find(r => r.value === priceRange);
      if (selectedRange) {
        if (price < selectedRange.min || price >= selectedRange.max) return false;
      }
    }

    if (rating) {
      const productRating = product.rating ?? 0;
      switch (rating) {
        case '4plus':
          if (productRating < 4) return false;
          break;
        case '3plus':
          if (productRating < 3) return false;
          break;
        case '2plus':
          if (productRating < 2) return false;
          break;
      }
    }

    if (availability) {
      const stock = product.stock ?? 0;
      if (availability === 'instock' && stock === 0) return false;
      if (availability === 'outofstock' && stock > 0) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'priceLow': {
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price || '0');
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price || '0');
        return priceA - priceB;
      }
      case 'priceHigh': {
        const priceAH = typeof a.price === 'number' ? a.price : parseFloat(a.price || '0');
        const priceBH = typeof b.price === 'number' ? b.price : parseFloat(b.price || '0');
        return priceBH - priceAH;
      }
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0);
      case 'relevant':
      default:
        return 0;
    }
  });

  const activeFiltersCount = [priceRange, rating, availability].filter(Boolean).length;

  const handleResetFilters = () => {
    setPriceRange('');
    setRating('');
    setAvailability('');
    setSortBy('relevant');
  };

  // Normaliza producto backend -> shape de UI
  function mapBackendProduct(item: any) {
    if (!item) return null;
    const categorias = item.categorias ?? item.categories ?? [];

    const mappedCategories = Array.isArray(categorias)
      ? categorias.map((cat: any) => ({
          id: cat.id ?? null,
          id_product_category: cat.id ?? null,
          name: cat.name ?? cat.element ?? null,
          element: cat.name ?? cat.element ?? null,
          type: cat.type ?? null,
          classification: cat.classification ?? cat.clasification ?? null,
          clasification: cat.classification ?? cat.clasification ?? null,
        }))
      : [];

    const imageUrl = item.imageUrl ?? item.image_url ?? item.image ?? undefined;

    // price puede venir como string (BigDecimal)
    let price: number | string | undefined = undefined;
    if (item.price !== undefined && item.price !== null) {
      const n = Number(item.price);
      price = !Number.isNaN(n) ? n : String(item.price);
    }

    const rating = item.rating !== undefined && item.rating !== null ? Number(item.rating) : undefined;

    return {
      id: item.id != null ? String(item.id) : '',
      name: item.productName ?? item.product_name ?? item.name ?? '',
      productName: item.productName ?? item.product_name ?? item.name ?? '',
      description: item.description ?? '',
      price,
      image_url: imageUrl,
      image: imageUrl,
      categories: mappedCategories,
      categorias: mappedCategories,
      category: mappedCategories[0]?.element ?? mappedCategories[0]?.name ?? item.category ?? '',
      rating,
      stock: item.stock ?? 0,
      vendedor: item.vendedor ?? null,
      _raw: item,
    };
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 mt-24">
      {/* Botón volver al inicio */ }
      <button
        onClick={() => router.push('/')}
        className="mb-6 flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        Volver al inicio
      </button>

      <div className="mb-4">
        {/* Título y botón filtros (mismo estilo que products) */}
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-red-800">
              Resultados Para:
            </h1>
            <div className="ml-2">
              <span className="text-sm inline-block px-2 py-1 rounded text-red-600 bg-red-50 font-medium">
                {query || '—'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {filteredAndSortedResults.length} {filteredAndSortedResults.length === 1 ? 'resultado' : 'resultados'}
            </span>

            {category && (
              <span className="ml-2 text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded font-semibold">({category})</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
                showFilters
                  ? 'bg-[#C73838] text-white'
                  : 'bg-white text-[#C73838] border-2 border-[#C73838] hover:bg-red-50'
              }`}
            >
              <IconAdjustmentsHorizontal size={18} stroke={2.2} />
              <span className="text-sm">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-black ${
                  showFilters ? 'bg-white/25' : 'bg-[#C73838] text-white'
                }`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Navega y filtra los resultados para encontrar lo que buscas.
        </p>

        <div className="mt-4 border-b border-gray-100" />
      </div>

      {/* Panel de filtros (expandible) */}
      {showFilters && (
        <div className="pt-4 pb-6 border-b border-gray-100 animate-in fade-in slide-in-from-up-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {/* Precio */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <IconCurrencyDollar size={16} className="text-blue-600" />
                </div>
                <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                  Rango de Precio
                </label>
              </div>

              <FilterSelect<string>
                value={priceRange}
                onChange={(v) => setPriceRange(v)}
                placeholder="Rango de Precio"
                icon={<IconCurrencyDollar size={16} className="text-blue-600" />}
                options={[
                  { label: 'Todos los precios', value: '' },
                  ...priceStats.ranges.map(r => ({ label: r.label, value: r.value }))
                ]}
              />
            </div>

            {/* Calificación */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <IconStar size={16} className="text-amber-500" />
                </div>
                <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                  Calificación
                </label>
              </div>

              <FilterSelect<string>
                value={rating}
                onChange={(v) => setRating(v)}
                placeholder="Calificación"
                icon={<IconStar size={16} className="text-amber-500" />}
                options={[
                  { label: 'Todas las calificaciones', value: '' },
                  { label: '4 estrellas o más', value: '4plus' },
                  { label: '3 estrellas o más', value: '3plus' },
                  { label: '2 estrellas o más', value: '2plus' },
                ]}
              />
            </div>

            {/* Disponibilidad */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <IconBox size={16} className="text-green-600" />
                </div>
                <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                  Disponibilidad
                </label>
              </div>

              <FilterSelect<string>
                value={availability}
                onChange={(v) => setAvailability(v)}
                placeholder="Disponibilidad"
                icon={<IconBox size={16} className="text-green-600" />}
                options={[
                  { label: 'Todos', value: '' },
                  { label: 'En stock', value: 'instock' },
                  { label: 'Agotado', value: 'outofstock' },
                ]}
              />
            </div>

            {/* Ordenar por */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <IconArrowsSort size={16} className="text-purple-600" />
                </div>
                <label className="text-xs font-black text-gray-900 uppercase tracking-widest">
                  Ordenar por
                </label>
              </div>

              <FilterSelect<string>
                value={sortBy}
                onChange={(v) => setSortBy(v)}
                placeholder="Ordenar por"
                icon={<IconArrowsSort size={16} className="text-purple-600" />}
                options={[
                  { label: 'Más relevante', value: 'relevant' },
                  { label: 'Precio menor', value: 'priceLow' },
                  { label: 'Precio mayor', value: 'priceHigh' },
                  { label: 'Mejor calificación', value: 'rating' },
                ]}
              />
            </div>
          </div>

          {/* Reset filtros */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C73838] rounded-full"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-[#C73838]">{activeFiltersCount}</span>
                  <span className="ml-1.5">filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}</span>
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 text-sm font-bold text-[#C73838] hover:text-[#B11212] transition-all duration-200 hover:gap-3"
              >
                <IconX size={16} />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filtros activos cortos (chips) desde query params */}
      {Object.keys(filtersFromParams).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(filtersFromParams).map(([key, value]) => (
            <span key={key} className="inline-flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {key}: {value}
            </span>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-red-400 mb-6">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-300"></span>
          Buscando...
        </div>
      )}

      {error && <div className="text-red-600 mb-6">{error}</div>}

      {!loading && !error && filteredAndSortedResults.length === 0 && (
        <div className="text-gray-500 text-center py-12">No se encontraron productos.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredAndSortedResults.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center 
              transition-transform duration-200 ease-in-out
              hover:scale-[1.02] hover:shadow-md hover:ring-1 hover:ring-red-100"
          >
            {/* Imagen */}
            <div className="w-full flex items-center justify-center mb-4 min-h-[80px]">
              {(product.image_url || product.image) ? (
                <img
                  src={product.image_url || product.image}
                  alt={product.name}
                  className="h-32 w-full object-contain mb-4 rounded bg-gray-50"
                  onError={e => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.onerror = null;
                    img.src = '/images/image-not-found.png';
                  }}
                />
              ) : (
                <div className="h-32 w-full flex items-center justify-center rounded bg-gray-50 text-gray-400 text-sm">
                  Imagen no disponible
                </div>
              )}
            </div>

            {/* Título de producto */}
            <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">
              {product.name}
            </h4>

            {/* Descripción si existe */}
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            )}

            {/* Precio */}
            {product.price !== undefined && (
              <span className="text-red-600 font-semibold text-lg block mb-2 mt-2 transition-colors duration-200">
                {typeof product.price === 'number'
                  ? `€${product.price.toLocaleString()}`
                  : product.price}
              </span>
            )}

            {/* Chips de categorías */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(product.categories) && product.categories.length > 0
                ? product.categories.flatMap((cat, cidx) =>
                    [cat.element, cat.type, cat.clasification]
                      .filter((val): val is string => Boolean(val))
                      .map((tech, tidx) => (
                        <span
                          key={`cat-${product.id}-${cat.id_product_category ?? cidx}-${tidx}-${tech}`}
                          className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer hover:bg-red-600 hover:text-white"
                        >
                          {tech}
                        </span>
                      ))
                  )
                : (
                  <span className="bg-gray-50 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {product.category || 'Sin categoría'}
                  </span>
                )
              }
            </div>

            {/* Botón */}
            <div className="flex gap-2 mt-4 w-full">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors duration-200 font-semibold w-full"
                onClick={() => setSelectedProduct(product)}
              >
                Ver producto
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}