// Barra de búsqueda avanzada con autocompletado, historial y filtros
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  debounceMs?: number;
  closeOnScroll?: boolean;
  scrollThreshold?: number;
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
  debounceMs = 300,
  closeOnScroll = true,
  scrollThreshold = 50,
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
  const [expanding, setExpanding] = useState(false);
  const [forceExpanded, setForceExpanded] = useState(false);
  const [isShrunk, setIsShrunk] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- Referencias y hooks de navegación ---
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Abort controller y cache
  const controllerRef = useRef<AbortController | null>(null);
  const suggestionCache = useRef<Map<string, Suggestion[]>>(new Map());
  const timeoutRefs = useRef<{
    blurTimeout: NodeJS.Timeout | null;
    scrollTimeout: NodeJS.Timeout | null;
    debounceTimeout: NodeJS.Timeout | null;
    expandTimeout: NodeJS.Timeout | null;
  }>({
    blurTimeout: null,
    scrollTimeout: null,
    debounceTimeout: null,
    expandTimeout: null,
  });

  // --- Efectos secundarios ---
  // Manejo de shrink/expand
  useEffect(() => {
    setIsShrunk(!forceExpanded);
  }, [forceExpanded]);

  // Lógica para cerrar al hacer scroll
  useEffect(() => {
    if (!closeOnScroll || !forceExpanded) return;

    const handleScroll = () => {
      if (timeoutRefs.current.scrollTimeout) {
        clearTimeout(timeoutRefs.current.scrollTimeout);
      }

      timeoutRefs.current.scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        if (scrollDelta > scrollThreshold) {
          setForceExpanded(false);
          setShowFilters(false);
          setSuggestions([]);
          setHighlightedIndex(-1);
        }
        
        setLastScrollY(currentScrollY);
      }, 100);
    };

    setLastScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRefs.current.scrollTimeout) {
        clearTimeout(timeoutRefs.current.scrollTimeout);
      }
    };
  }, [closeOnScroll, forceExpanded, lastScrollY, scrollThreshold]);

  // Cargar historial desde localStorage
  useEffect(() => {
    const savedHistory = typeof window !== 'undefined' ? localStorage.getItem('searchHistory') : null;
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch {
        setSearchHistory([]);
      }
    }
  }, []);

  // Cerrar panel de filtros si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowFilters(false);
        setSuggestions([]);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atajos globales: '/' o 'Ctrl+K' para enfocar la barra
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement && (document.activeElement as HTMLElement).tagName) || '';
      const editable = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
      if (editable) return;

      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        handleExpandClick();
      }
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleExpandClick();
      }
      if (e.key === 'Escape' && forceExpanded) {
        e.preventDefault();
        setForceExpanded(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [forceExpanded]);

  // Autocompletado con debounce, cache y AbortController
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      return;
    }

    const cacheKey = `${query}|${selectedCategory}|${JSON.stringify(activeFilters)}`;
    const cached = suggestionCache.current.get(cacheKey);
    if (cached) {
      setSuggestions(cached);
      return;
    }

    if (timeoutRefs.current.debounceTimeout) {
      clearTimeout(timeoutRefs.current.debounceTimeout);
    }

    timeoutRefs.current.debounceTimeout = setTimeout(async () => {
      setIsLoading(true);
      
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const params = new URLSearchParams({
          q: query,
          ...(selectedCategory && { category: selectedCategory }),
        });
        
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') params.append(key, value.toString());
        });
        
        const response = await fetch(`/api/search/suggest?${params}`, { signal: controller.signal });
        
        if (!response.ok) throw new Error('Error en la petición');
        
        const data = await response.json();
        const results: Suggestion[] = Array.isArray(data.results) ? data.results : [];
        
        suggestionCache.current.set(cacheKey, results);
        
        if (!controller.signal.aborted) {
          setSuggestions(results);
          setHighlightedIndex(-1);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setSuggestions([]);
          console.error('Error fetching suggestions:', error);
        }
      } finally {
        setIsLoading(false);
        controllerRef.current = null;
      }
    }, debounceMs);

    return () => {
      if (timeoutRefs.current.debounceTimeout) {
        clearTimeout(timeoutRefs.current.debounceTimeout);
      }
    };
  }, [query, selectedCategory, activeFilters, debounceMs]);

  // Mostrar historial si input enfocado y vacío
  useEffect(() => {
    if (!inputFocused || query.length > 1) return;
    setSuggestions(searchHistory.map((item, idx) => ({
      id: `history-${idx}`,
      title: item,
      isHistory: true,
    })));
    setHighlightedIndex(-1);
  }, [inputFocused, query, searchHistory]);

  // --- Handlers principales ---
  const handleExpandClick = useCallback(() => {
    if (!forceExpanded) {
      setExpanding(true);
      setForceExpanded(true);
      setLastScrollY(window.scrollY);
      
      if (timeoutRefs.current.expandTimeout) {
        clearTimeout(timeoutRefs.current.expandTimeout);
      }
      
      timeoutRefs.current.expandTimeout = setTimeout(() => {
        setIsShrunk(false);
        setExpanding(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }, 300);
    } else {
      inputRef.current?.focus();
    }
  }, [forceExpanded]);

  const handleCollapse = useCallback(() => {
    setForceExpanded(false);
    setShowFilters(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
  }, []);

  const handleSearch = useCallback((q?: string) => {
    const actualQuery = (q ?? query).trim();
    if (!actualQuery) return;
    
    const updatedHistory = [actualQuery, ...searchHistory.filter(item => item !== actualQuery)].slice(0, 5);
    setSearchHistory(updatedHistory);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
    
    const queryParams: Record<string, string> = { q: actualQuery };
    if (selectedCategory) queryParams.category = selectedCategory;
    
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') queryParams[`filter_${key}`] = value.toString();
    });
    
    const params = new URLSearchParams(queryParams).toString();
    router.push(`/search?${params}`);
    
    if (onSearch) onSearch(actualQuery);
    
    // Colapsar en móvil después de buscar
    if (window.innerWidth < 768) {
      setTimeout(() => {
        setForceExpanded(false);
      }, 300);
    }
  }, [query, searchHistory, selectedCategory, activeFilters, onSearch, router]);

  const handleFilterChange = useCallback((filterId: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [filterId]: value }));
  }, []);

  const clearFilter = useCallback((filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('searchHistory');
    }
    setSuggestions([]);
  }, []);

  const handleSelectSuggestion = useCallback((idx: number) => {
    if (idx < 0) return;
    if (idx < suggestions.length) {
      const item = suggestions[idx];
      setQuery(item.title);
      setSuggestions([]);
      handleSearch(item.title);
    } else {
      handleSearch(query);
    }
  }, [suggestions, query, handleSearch]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalSuggestionItems = suggestions.length + (query.trim().length > 0 ? 1 : 0);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (totalSuggestionItems === 0) return;
      setHighlightedIndex(prev => (prev + 1 + totalSuggestionItems) % totalSuggestionItems);
      return;
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (totalSuggestionItems === 0) return;
      setHighlightedIndex(prev => (prev - 1 + totalSuggestionItems) % totalSuggestionItems);
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelectSuggestion(highlightedIndex);
      } else {
        handleSearch();
      }
      return;
    }
    
    if (e.key === 'Escape') {
      if (suggestions.length > 0 || inputFocused) {
        setSuggestions([]);
        setHighlightedIndex(-1);
      } else {
        handleCollapse();
      }
      return;
    }
  }, [suggestions, query, highlightedIndex, handleSelectSuggestion, handleSearch, inputFocused, handleCollapse]);

  const handleSuggestionMouseEnter = useCallback((idx: number) => {
    setHighlightedIndex(idx);
  }, []);

  const handleRemoveHistoryItem = useCallback((itemTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = searchHistory.filter(h => h !== itemTitle);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSuggestions(suggestions.filter(s => s.id !== `history-${searchHistory.indexOf(itemTitle)}`));
  }, [searchHistory, suggestions]);

  // --- Utilidades visuales ---
  const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined && v !== '');
  const sizeClass = size === 'sm' ? 'max-w-xs' : size === 'md' ? 'max-w-sm' : 'max-w-lg';
  const suggestionsOpen = (suggestions.length > 0) || (inputFocused && !query && searchHistory.length > 0);

  const renderHighlighted = useCallback((text: string, q: string) => {
    if (!q) return text;
    try {
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
      const parts = text.split(re);
      return (
        <>
          {parts.map((part, i) =>
            re.test(part) ? <mark key={i} className="bg-yellow-100 text-black font-semibold">{part}</mark> : <span key={i}>{part}</span>
          )}
        </>
      );
    } catch {
      return text;
    }
  }, []);

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      Object.values(timeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // --- Renderizado ---
  return (
    <div className="w-full">
      {/* Barra principal */}
      <div className="flex justify-end relative">
        <div
          ref={searchRef}
          className={`transition-all duration-300 ${isShrunk && !expanding
            ? 'w-10 h-10 p-0 rounded-full border border-red-300 flex items-center justify-center bg-white text-black shadow-md z-[200] right-0'
            : `w-full md:w-[400px] ${sizeClass} rounded-xl border border-red-200 bg-white text-black shadow-lg z-[300]`}`}
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
              onClick={handleExpandClick}
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
                  id="search-input"
                  ref={inputRef}
                  role="combobox"
                  aria-expanded={suggestionsOpen}
                  aria-controls="search-suggestions"
                  aria-autocomplete="list"
                  aria-activedescendant={highlightedIndex >= 0 ? `search-suggestion-${highlightedIndex}` : undefined}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setHighlightedIndex(-1); }}
                  onKeyDown={handleInputKeyDown}
                  onFocus={() => {
                    if (timeoutRefs.current.blurTimeout) {
                      clearTimeout(timeoutRefs.current.blurTimeout);
                    }
                    setInputFocused(true);
                  }}
                  onBlur={() => {
                    timeoutRefs.current.blurTimeout = setTimeout(() => {
                      setInputFocused(false);
                    }, 200);
                  }}
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
                  onClick={() => handleSearch()}
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
                {suggestionsOpen && (
                  <div id="search-suggestions" role="listbox" className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-xl py-1 text-base ring-1 ring-red-200 ring-opacity-60 overflow-auto max-h-60 focus:outline-none">
                    {/* Si no hay resultados pero sí se esperaba alguno */}
                    {suggestions.length === 0 && query.length >= 2 && !isLoading && (
                      <div className="px-4 py-2 text-red-300 text-sm">Sin resultados</div>
                    )}

                    {/* Muestra las sugerencias (o historial) */}
                    {suggestions.map((item, idx) => {
                      const isActive = highlightedIndex === idx;
                      const isHistory = item.isHistory;
                      return (
                        <div
                          id={`search-suggestion-${idx}`}
                          key={item.id}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors duration-150 bg-white
                            ${isActive ? (isHistory ? 'bg-red-100/80' : 'bg-red-100') : ''}
                            ${!isActive ? 'hover:bg-red-50' : ''}`}
                          onClick={() => {
                            setQuery(item.title);
                            setSuggestions([]);
                            handleSearch(item.title);
                          }}
                          onMouseEnter={() => handleSuggestionMouseEnter(idx)}
                          onMouseDown={(e) => e.preventDefault()}
                          aria-selected={isActive}
                          role="option"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <span className="font-normal text-black block truncate">{renderHighlighted(item.title, query)}</span>
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
                                onClick={(e) => handleRemoveHistoryItem(item.title, e)}
                                aria-label="Eliminar del historial"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Separador y 'Ver todos resultados' */}
                    {query.trim().length > 0 && (
                      <>
                        <div className="border-t border-red-100 my-1" />
                        <div
                          id={`search-suggestion-${suggestions.length}`}
                          role="option"
                          aria-selected={highlightedIndex === suggestions.length}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors duration-150 bg-white ${highlightedIndex === suggestions.length ? 'bg-red-100' : 'hover:bg-red-50'}`}
                          onClick={() => handleSearch(query)}
                          onMouseEnter={() => handleSuggestionMouseEnter(suggestions.length)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <span className="font-medium text-[#C73838]">Ver todos los resultados para "<span className="font-normal">{query}</span>"</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Botón para limpiar todo el historial (si se muestra historial) */}
                    {inputFocused && !query && searchHistory.length > 0 && (
                      <div className="border-t border-red-100 my-1 px-3 py-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Historial de búsqueda</span>
                        <button
                          className="text-sm text-[#C73838] hover:text-[#B11212] font-medium"
                          onClick={() => clearHistory()}
                        >
                          Borrar historial
                        </button>
                      </div>
                    )}
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
      {categories.length > 0 && forceExpanded && (
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
      {hasActiveFilters && forceExpanded && (
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
      {showFilters && filters.length > 0 && forceExpanded && (
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