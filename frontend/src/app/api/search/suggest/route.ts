import { NextResponse } from 'next/server';
import API_BASE  from '@/lib/apiBase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || searchParams.get('categoryId') || '';

  if (!q) return NextResponse.json({ results: [] });

  // Construir URL al backend usando 'q' y opcionalmente 'categoryId' si es numérico
  const params = new URLSearchParams();
  params.append('q', q);

  // Si category parece un id numérico, pasar como categoryId
  if (category && /^\d+$/.test(category)) {
    params.append('categoryId', category);
  }

  const apiUrl = `${API_BASE}/products?${params.toString()}`;
  const res = await fetch(apiUrl);

  if (!res.ok) return NextResponse.json({ results: [] });

  const data = await res.json();

  const results = (data || []).map((item: any) => ({
    id: String(item.id),
    title: item.productName || item.product_name || item.name || '',
    category: item.categorias?.[0]?.name || item.categories?.[0]?.name || item.categories?.[0]?.element || '',
  }));

  return NextResponse.json({ results });
}