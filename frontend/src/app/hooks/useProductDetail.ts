import useSWR from 'swr';
import { Product } from '../types/product';
import API_BASE from '@/lib/apiBase';

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
  if (!product) return null;
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
    throw new Error('Error al obtener el producto');
  }
  return normalizeProduct(await res.json());
};

export function useProductDetail(id: number | string) {
  const { data, error, isLoading } = useSWR<Product>(
    id ? `${API_BASE}/products/${id}` : null, 
    fetcher
  );
  return { product: data, isLoading, error };
}