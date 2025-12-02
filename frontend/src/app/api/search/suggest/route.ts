import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (!q) return NextResponse.json({ results: [] });

  // Llama a la API pública
  const apiUrl = `https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/products/public/?search=${encodeURIComponent(q)}`;
  const res = await fetch(apiUrl);
  if (!res.ok) return NextResponse.json({ results: [] });

  const data = await res.json();

  // Adapta los resultados al formato esperado por tu Searchbar
  const results = (data?.results || data || []).map((item: any) => ({
    id: String(item.id),
    title: item.name || item.title || '',
    category: item.category || '',
  }));

  return NextResponse.json({ results });
}