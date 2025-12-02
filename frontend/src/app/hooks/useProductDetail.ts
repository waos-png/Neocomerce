import useSWR from 'swr';
import { Product } from '../types/product';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProductDetail(id: number | string) {
  const { data, error, isLoading } = useSWR<Product>(
    id ? `https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/products/public/${id}/` : null,
    fetcher
  );
  return { product: data, isLoading, error };
}