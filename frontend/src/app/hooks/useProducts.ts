import useSWR from 'swr';
import API_BASE from '@/lib/apiBase';

const normalizeCategory = (category: any): any => {
  if (!category || typeof category !== 'object') return null;
  return {
    id: category.id ?? null,
    id_product_category: category.id ?? null,
    name: category.name ?? category.element ?? null,
    element: category.name ?? category.element ?? null,
    type: category.type ?? null,
    classification: category.classification ?? null,
    clasification: category.classification ?? category.clasification ?? null,
  };
};

const normalizeProduct = (product: any): any => {
  if (!product || typeof product !== 'object') return null;
  const categorias = product.categorias ?? product.categories ?? [];
  return {
    id: product.id ?? null,
    product_name: product.productName ?? product.product_name ?? product.name ?? null,
    productName: product.productName ?? product.product_name ?? product.name ?? null,
    name: product.productName ?? product.product_name ?? product.name ?? null,
    description: product.description ?? null,
    price: product.price ?? null,
    image_url: product.imageUrl ?? product.image_url ?? product.image ?? null,
    imageUrl: product.imageUrl ?? product.image_url ?? product.image ?? null,
    image: product.imageUrl ?? product.image_url ?? product.image ?? null,
    rating: product.rating ?? null,
    stock: product.stock ?? null,
    activo: product.activo ?? null,
    vendedor: product.vendedor ?? null,
    categorias: Array.isArray(categorias) ? categorias.map(normalizeCategory).filter(Boolean) : [],
    categories: Array.isArray(categorias) ? categorias.map(normalizeCategory).filter(Boolean) : [],
    creadoEn: product.creadoEn ?? product.creado_en ?? null,
    actualizadoEn: product.actualizadoEn ?? product.actualizado_en ?? null,
  };
};

const fetcher = async (url: string) => {
  console.debug('[useProducts] fetching', url);
  try {
    const res = await fetch(url, { mode: 'cors' });
    // Si la petición falla a nivel de red, entra en catch con "TypeError: Failed to fetch"
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[useProducts] fetch returned ${res.status} ${res.statusText}`, text);
      return [];
    }
    const data = await res.json().catch((err) => {
      console.error('[useProducts] JSON parse error', err);
      return null;
    });
    if (!data) return [];
    if (Array.isArray(data)) return data.map(normalizeProduct).filter(Boolean);
    const single = normalizeProduct(data);
    return single ? [single] : [];
  } catch (err: any) {
    console.error('[useProducts] network/fetch error', err);
    return [];
  }
};

export function useProducts(search?: string, categoryId?: string | number) {
  const params = new URLSearchParams();
  if (search) params.append('q', search);
  if (categoryId) params.append('categoryId', String(categoryId));

  const key = `${API_BASE}/products${params.toString() ? `?${params.toString()}` : ''}`;

  const { data, error, isLoading } = useSWR<any[]>(key, fetcher);

  return {
    products: data || [],
    isLoading,
    error,
  };
}