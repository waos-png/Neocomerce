import { API_BASE } from '@/lib/apiBase'; // si tu alias @ apunta a src, si no usa '../../lib/apiBase'
export type ApiResponse<T = any> = T | null;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  // Priorizar token regular; usar sellerToken solo si es vendedor
  const token = localStorage.getItem("token");
  if (token) return token;
  const sellerToken = localStorage.getItem("sellerToken");
  return sellerToken || null;
}

function normalizeHeaders(h?: HeadersInit): Record<string,string> {
  const headers: Record<string,string> = {};
  if (!h) return headers;
  if (h instanceof Headers) {
    h.forEach((value, key) => headers[key] = value);
  } else if (Array.isArray(h)) {
    (h as [string,string][]).forEach(([k,v]) => headers[k] = v);
  } else {
    Object.assign(headers, h as Record<string,string>);
  }
  return headers;
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers = normalizeHeaders(options.headers);
  if (!headers["content-type"]) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text || res.statusText || `HTTP ${res.status}`;
    try {
      const json = JSON.parse(text || "{}");
      message = json?.detail || json?.message || message;
    } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const txt = await res.text().catch(() => "");
    try { return (txt ? JSON.parse(txt) : null) as ApiResponse<T>; } catch { return (txt as unknown) as ApiResponse<T>; }
  }
  return res.json();
}

/* Profile */
export async function fetchProfile(): Promise<any> {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  if (!user?.id) return null;
  return request(`/usuarios/${user.id}`);
}

export async function updateProfile(data: any): Promise<any> {
  if (typeof window === "undefined") throw new Error('No user context');
  const userStr = localStorage.getItem("user");
  if (!userStr) throw new Error('No usuario logueado');
  const user = JSON.parse(userStr);
  return request(`/usuarios/${user.id}`, { method: "PUT", body: JSON.stringify(data) });
}

/* Orders */
export async function fetchOrdersHistory(): Promise<any> {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  return request(`/pedidos?usuarioId=${user.id}`);
}

/* Products (seller) */
export async function createProduct(payload: any): Promise<any> {
  return request(`/products`, { method: "POST", body: JSON.stringify(payload) });
}

export default {
  request,
  fetchProfile,
  updateProfile,
  fetchOrdersHistory,
  createProduct,
};