"use client";
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { NavbarDemo } from '../components/ui/NavbarDemo';
import { ProductsView } from './ProductsView';

export default function InfiniteProductsPage() {
  const { products, isLoading } = useInfiniteProducts();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NavbarDemo />
      </div>
      <div className="pt-24 flex flex-col items-center w-full min-h-screen bg-gray-50">
        <ProductsView products={products} isLoading={isLoading} title="Productos infinitos" />
      </div>
    </>
  );
}