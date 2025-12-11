import useSWR from 'swr';
import { Product } from '../types/product';
import API_BASE from '@/lib/apiBase';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Error al obtener el producto');
  }
  return res.json();
};

export function useProductDetail(id: number | string) {
  const { data, error, isLoading } = useSWR<Product>(
    id ? `${API_BASE}/products/${id}` : null, 
    fetcher
  );
  return { product: data, isLoading, error };
}