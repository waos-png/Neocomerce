import { NextResponse } from 'next/server';
import API_BASE  from '@/lib/apiBase';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (!q) return NextResponse.json({ results: [] });

  // Llama a la API pública
  const apiUrl = `${API_BASE}/products?p=${encodeURIComponent(q)}`;
  const res = await fetch(apiUrl);
  if (!res.ok) return NextResponse.json({ results: [] });

  const data = await res.json();

  // Adapta los resultados al formato esperado por tu Searchbar
  const results = (data || []).map((item: any) => ({
    id: String(item.id),
    title: item.product_name || item.name || '',
    category: item.categories?.[0]?.element|| item.category || '',
  }));

  return NextResponse.json({ results });
}