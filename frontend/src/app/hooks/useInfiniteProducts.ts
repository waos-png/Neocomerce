import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { Product } from '../types/product';
import API_BASE from '@/lib/apiBase';

const PAGE_SIZE = 20;
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Error al obtener productos');
  }
  return res.json();
};


export function useInfiniteProducts() {
  const { data, isLoading, error } = useSWR<Product[]>(`${API_BASE}/products`, fetcher);
  const [page, setPage] = useState(1);

  const products = useMemo(() => {
    const all = data || [];
    return all.slice(0, page * PAGE_SIZE);
  }, [data, page]);

  const hasMore = (data?.length || 0) > products.length;

  return {
    products,
    isLoading,
    error,
    loadMore: () => {
      if (hasMore) setPage(prev => prev + 1);
    },
    hasMore,
  };
}