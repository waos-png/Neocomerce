import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { Product } from '../types/product';
import API_BASE from '@/lib/apiBase';

const PAGE_SIZE = 20;

const normalizeCategory = (category: any): any => {
  return {
    id: category.id,
    id_product_category: category.id,
    name: category.name,
    element: category.name,
    type: category.type,
    classification: category.classification,
    clasification: category.classification,
  };
};

const normalizeProduct = (product: any): any => {
  return {
    id: product.id,
    product_name: product.productName || product.product_name,
    productName: product.productName || product.product_name,
    name: product.productName || product.name,
    description: product.description,
    price: product.price,
    image_url: product.imageUrl || product.image_url,
    imageUrl: product.imageUrl || product.image_url,
    image: product.imageUrl || product.image,
    rating: product.rating,
    stock: product.stock,
    activo: product.activo,
    vendedor: product.vendedor,
    categorias: product.categorias?.map(normalizeCategory) || [],
    categories: product.categorias?.map(normalizeCategory) || [],
    creadoEn: product.creadoEn,
    actualizadoEn: product.actualizadoEn,
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Error al obtener productos');
  }
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeProduct) : normalizeProduct(data);
};


export function useInfiniteProducts() {
  const { data, isLoading, error } = useSWR<any[]>(`${API_BASE}/products`, fetcher);
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