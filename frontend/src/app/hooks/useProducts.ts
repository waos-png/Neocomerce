import useSWR from 'swr';
import { Product } from '../types/product';
import API_BASE from '@/lib/apiBase';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Error al obtener productos');
  }
  return res.json();
};

export function useProducts(search?: string, categoryId?: string | number) {
  const params = new URLSearchParams();
  if (search) params.append('q', search);
  if (categoryId) params.append('categoryId', String(categoryId));

  const { data, error, isLoading } = useSWR<Product[]>(
    `${API_BASE}/products${params.toString() ? `?${params.toString()}` : ''}`,
    fetcher
  );

  return {
    products: data || [],
    isLoading,
    error,
  };
}