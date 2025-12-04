export type ApiResponse<T = any> = T | null;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sellerToken") || localStorage.getItem("token") || null;
}

/**
 * Normaliza HeadersInit a un objeto plano Record<string,string>.
 * Maneja Headers, array de tuples y objetos planos.
 */
function normalizeHeaders(h?: HeadersInit): Record<string,string> {
  const headers: Record<string,string> = {};
  if (!h) return headers;

  if (h instanceof Headers) {
    h.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(h)) {
    (h as [string, string][]).forEach(([key, value]) => {
      headers[key] = value;
    });
  } else {
    Object.assign(headers, h as Record<string,string>);
  }
  return headers;
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();

  // Normalizamos cualquier headers que venga en options
  const headers = normalizeHeaders(options.headers);
  // Valor por defecto
  if (!headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

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
    try {
      return (txt ? JSON.parse(txt) : null) as ApiResponse<T>;
    } catch {
      return (txt as unknown) as ApiResponse<T>;
    }
  }
  return res.json();
}

/* Profile */
export async function fetchProfile(): Promise<any> {
  const isSeller = typeof window !== "undefined" && !!localStorage.getItem("sellerToken");
  const endpoint = isSeller ? "/profile/seller/" : "/profile/user/";
  return request(endpoint);
}

export async function updateProfile(data: any): Promise<any> {
  const isSeller = typeof window !== "undefined" && !!localStorage.getItem("sellerToken");
  const endpoint = isSeller ? "/profile/seller/update/" : "/profile/user/update/";
  return request(endpoint, { method: "PUT", body: JSON.stringify(data) });
}

/* Orders */
export async function fetchOrdersHistory(): Promise<any> {
  return request("/orders/history/");
}

/* Products (seller) */
export async function createProduct(payload: any): Promise<any> {
  return request("/products/create/", { method: "POST", body: JSON.stringify(payload) });
}

/* Export default for convenience */
export default {
  request,
  fetchProfile,
  updateProfile,
  fetchOrdersHistory,
  createProduct,
};