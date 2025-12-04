// Barra de búsqueda avanzada con autocompletado, historial y filtros
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Tipado para las opciones de filtro
interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'range' | 'select';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

// Props del componente de búsqueda
interface SearchBarProps {
  categories?: string[];
  filters?: FilterOption[];
  initialQuery?: string;
  initialCategory?: string;
  initialFilters?: Record<string, any>;
  size?: 'sm' | 'md' | 'lg';
  onSearch?: (query: string) => void;
}

// Tipado para sugerencias de autocompletado
interface Suggestion {
  id: string;
  title: string;
  category?: string;
  isHistory?: boolean;
}

export default function AdvancedSearchBar({
  categories = [],
  filters = [],
  initialQuery = '',
  initialCategory = '',
  initialFilters = {},
  size = 'sm',
  onSearch,
}: SearchBarProps) {
  // --- Estados principales ---
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);

  // --- Referencias y hooks de navegación ---
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- Estados para animaciones y expansión ---
  const [expanding, setExpanding] = useState(false);
  const [forceExpanded, setForceExpanded] = useState(false);
  const [isShrunk, setIsShrunk] = useState(true);

  // --- Efectos secundarios ---
  // Manejo de shrink/expand
  useEffect(() => {
    if (setIsShrunk) {
      if (forceExpanded) setIsShrunk(false);
      else setIsShrunk(true);
    }
  }, [forceExpanded]);

  // Manejo de scroll para cerrar expansión
  useEffect(() => {
    const handleScroll = () => setForceExpanded(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cargar historial desde localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  // Cerrar panel de filtros si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocompletado con debounce
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          ...(selectedCategory && { category: selectedCategory }),
        });
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') params.append(key, value.toString());
        });
        const response = await fetch(`/api/search/suggest?${params}`);
        if (!response.ok) throw new Error('Error en la petición');
        const data = await response.json();
        setSuggestions(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        setSuggestions([]);
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedCategory, activeFilters]);

  // Mostrar historial si input enfocado y vacío
  useEffect(() => {
    if (!inputFocused || query.length > 1) return;
    setSuggestions(searchHistory.map((item, idx) => ({
      id: `history-${idx}`,
      title: item,
      isHistory: true,
    })));
  }, [inputFocused, query, searchHistory]);

  // --- Handlers principales ---
  const handleSearch = () => {
    if (!query.trim()) return;
    const updatedHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
    setSearchHistory(updatedHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
    const queryParams: Record<string, string> = { q: query };
    if (selectedCategory) queryParams.category = selectedCategory;
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') queryParams[`filter_${key}`] = value.toString();
    });
    const params = new URLSearchParams(queryParams).toString();
    router.push(`/search?${params}`);
    if (onSearch) onSearch(query);
  };

  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const clearFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const clearAllFilters = () => setActiveFilters({});

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      const item = suggestions[highlightedIndex];
      setQuery(item.title);
      setSuggestions([]);
      handleSearch();
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  };

  // --- Utilidades visuales ---
  const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined && v !== '');
  const sizeClass = size === 'sm' ? 'max-w-xs' : size === 'md' ? 'max-w-sm' : 'max-w-lg';

  // --- Renderizado ---
  return (
    <div className="w-full">
      {/* Barra principal */}
      <div className="flex justify-end relative">
        <div
          ref={searchRef}
          className={`transition-all duration-300 ${isShrunk && !expanding
            ? 'w-10 h-10 p-0 rounded-full border border-red-300 flex items-center justify-center bg-white text-black shadow-md z-[200] right-0'
            : 'w-full md:w-[400px] max-w-lg rounded-xl border border-red-200 bg-white text-black shadow-lg z-[300]'}
          `}
          style={{
            minWidth: isShrunk && !expanding ? 40 : undefined,
            minHeight: isShrunk && !expanding ? 40 : undefined,
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          }}
        >
          {/* Modo reducido */}
          {isShrunk && !expanding ? (
            <button
              className="w-full h-full flex items-center justify-center focus:outline-none"
              aria-label="Mostrar barra de búsqueda"
              onClick={() => {
                setExpanding(true);
                setForceExpanded(true);
                setTimeout(() => {
                  setIsShrunk(false);
                  setExpanding(false);
                  setTimeout(() => {
                    const input = searchRef.current?.querySelector('input');
                    if (input) (input as HTMLInputElement).focus();
                  }, 10);
                }, 300);
              }}
            >
              <FiSearch className="w-5 h-5 text-[#C73838]" />
            </button>
          ) : (
            <div className="flex flex-col md:flex-row gap-2 w-full">
              {/* Input de búsqueda */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-[#C73838]" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setHighlightedIndex(-1); }}
                  onKeyDown={handleInputKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setTimeout(() => setInputFocused(false), 100)}
                  placeholder="Buscar productos..."
                  aria-label="Buscar productos"
                  className="block w-full pl-8 pr-20 py-2 text-base border border-red-200 rounded-xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-red-300 text-black"
                />
                {/* Limpiar input */}
                {query && (
                  <button
                    type="button"
                    aria-label="Limpiar búsqueda"
                    onClick={() => { setQuery(''); setSuggestions([]); setHighlightedIndex(-1); }}
                    className="absolute inset-y-0 right-14 pr-2 flex items-center text-gray-400 hover:text-[#C73838]"
                  >
                    <FiX />
                  </button>
                )}
                {/* Botón buscar */}
                <button
                  onClick={handleSearch}
                  disabled={!query.trim()}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-base border border-red-300 font-medium rounded-r-xl shadow text-[#C73838] bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#C73838] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ height: '100%' }}
                  aria-label="Buscar"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
                {/* Spinner */}
                {isLoading && (
                  <div className="absolute inset-y-0 right-24 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C73838]"></div>
                  </div>
                )}
                {/* Sugerencias/autocompletado */}
                {(suggestions.length > 0 || (inputFocused && !query && searchHistory.length > 0)) && (
                  <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-xl py-1 text-base ring-1 ring-red-200 ring-opacity-60 overflow-auto max-h-60 focus:outline-none">
                    {suggestions.length === 0 && (
                      <div className="px-4 py-2 text-red-300 text-sm">Sin resultados</div>
                    )}
                    {suggestions.map((item, idx) => {
                      const isActive = highlightedIndex === idx;
                      const isHistory = item.isHistory;
                      return (
                        <div
                          key={item.id}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors duration-150 bg-white
                            ${isActive ? (isHistory ? 'bg-red-100/80' : 'bg-red-100') : ''}
                            ${!isActive && isHistory ? 'hover:bg-red-50' : ''}
                            ${!isActive && !isHistory ? 'hover:bg-red-50' : ''}`
                          }
                          onClick={() => {
                            setQuery(item.title);
                            setSuggestions([]);
                            handleSearch();
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          aria-selected={isActive}
                          role="option"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <span className="font-normal text-black block truncate">{item.title}</span>
                              {item.category && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-red-200">
                                  {item.category}
                                </span>
                              )}
                              {isHistory && (
                                <span className="ml-2 text-xs text-[#C73838]">
                                  {idx === 0 ? "Búsqueda más reciente" : "Buscado anteriormente"}
                                </span>
                              )}
                            </div>
                            {/* Eliminar historial */}
                            {isHistory && (
                              <button
                                type="button"
                                className="ml-2 text-red-300 hover:text-[#C73838] p-1 rounded-full"
                                onClick={e => {
                                  e.stopPropagation();
                                  const updatedHistory = searchHistory.filter(h => h !== item.title);
                                  setSearchHistory(updatedHistory);
                                  localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
                                  setSuggestions(suggestions.filter(s => s.id !== item.id));
                                }}
                                aria-label="Eliminar del historial"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Botón filtros */}
              {filters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-2 text-base border font-medium rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C73838] ${
                    hasActiveFilters
                      ? 'border-transparent bg-[#C73838] text-white hover:bg-[#B11212]'
                      : 'border-red-200 bg-white text-[#C73838] hover:bg-red-50'
                  }`}
                >
                  <FiFilter className="mr-2" />
                  Filtros {hasActiveFilters && `(${Object.keys(activeFilters).length})`}
                  {showFilters ? (
                    <FiChevronUp className="ml-2" />
                  ) : (
                    <FiChevronDown className="ml-2" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selector de categorías */}
      {categories.length > 0 && (
        <div className="mb-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-red-300 focus:outline-none focus:ring-[#C73838] focus:border-red-300 sm:text-sm rounded-md bg-white text-[#C73838]"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (value === undefined || value === '') return null;
            const filter = filters.find(f => f.id === key);
            let displayValue = value;
            if (filter?.type === 'checkbox' && Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (filter?.type === 'range') {
              displayValue = `${value}${key === 'price_range' ? '€' : ''}`;
            }
            return (
              <span
                key={key}
                className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-xs font-medium bg-red-100 text-[#C73838]"
              >
                {filter?.label}: {displayValue}
                <button
                  type="button"
                  onClick={() => clearFilter(key)}
                  className="flex-shrink-0 ml-1 inline-flex text-red-400 hover:text-[#C73838]"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#C73838] hover:text-[#B11212] font-medium"
          >
            Limpiar todos
          </button>
        </div>
      )}

      {/* Panel de filtros avanzados */}
      {showFilters && filters.length > 0 && (
        <div className="bg-white p-4 mt-2 border border-red-300 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filtrar por</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#C73838] hover:text-[#B11212] font-medium"
            >
              Limpiar todos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filters.map(filter => (
              <div key={filter.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                {/* Checkbox */}
                {filter.type === 'checkbox' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${filter.id}-${option}`}
                          checked={activeFilters[filter.id]?.includes(option) || false}
                          onChange={(e) => {
                            const current = activeFilters[filter.id] || [];
                            const newValue = e.target.checked
                              ? [...current, option]
                              : current.filter((v: string) => v !== option);
                            handleFilterChange(filter.id, newValue);
                          }}
                          className="h-4 w-4 text-[#C73838] focus:ring-[#C73838] border-red-300 rounded"
                        />
                        <label
                          htmlFor={`${filter.id}-${option}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {/* Rango */}
                {filter.type === 'range' && filter.min !== undefined && filter.max !== undefined && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min}
                      max={filter.max}
                      step={filter.step || 1}
                      value={activeFilters[filter.id] || filter.min}
                      onChange={(e) => handleFilterChange(filter.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{filter.min}</span>
                      <span className="font-medium text-[#C73838]">
                        {activeFilters[filter.id] || filter.min}
                      </span>
                      <span>{filter.max}</span>
                    </div>
                  </div>
                )}
                {/* Select */}
                {filter.type === 'select' && filter.options && (
                  <select
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-red-300 focus:outline-none focus:ring-[#C73838] focus:border-red-300 sm:text-sm rounded-md bg-white text-[#C73838]"
                  >
                    <option value="">Todos</option>
                    {filter.options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}