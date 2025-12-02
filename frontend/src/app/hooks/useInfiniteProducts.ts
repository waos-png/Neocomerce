import useSWRInfinite from 'swr/infinite';
import { Product } from '../types/product';

const PAGE_SIZE = 20;
const fetcher = (url: string) => fetch(url).then(res => res.json());

const getKey = (pageIndex: number, previousPageData: Product[]) => {
  if (previousPageData && !previousPageData.length) return null;
  return `https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/products/public/?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`;
};

export function useInfiniteProducts() {
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher);
  const products = data ? [].concat(...data) : [];
  return { products, loadMore: () => setSize(size + 1), isLoading };
}