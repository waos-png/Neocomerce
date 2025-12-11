const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
const API_BASE = `${BASE.replace(/\/$/,'')}/cart`; 

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sellerToken") || localStorage.getItem("token") || null;
}

function getUserId(): number | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function fetchCart(userId?: number) {
  const id = userId || getUserId();
  if (!id) throw new Error("No hay usuario logueado");
  const url = `${API_BASE}?userId=${id}`; // -> /cart?userId=
  try {
    const token = getToken();
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${body || res.statusText}`);
    }
    return res.json();
  } catch (err) {
    console.error("[fetchCart] falló petición a", url, err);
    throw err;
  }
}

export async function addToCart(productId: string | number, quantity: number = 1, userId?: number) {
  const id = userId || getUserId();
  if (!id) throw new Error("No hay usuario logueado");
  const token = getToken();
  const res = await fetch(`${API_BASE}/add?userId=${id}`, { // <- nota la '/' antes de 'add'
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ productId: Number(productId), quantity }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Error al agregar al carrito");
  }
  return res.json();
}

export async function removeFromCart(productId: string | number, userId?: number) {
  const id = userId || getUserId();
  if (!id) throw new Error("No hay usuario logueado");
  const token = getToken();
  const res = await fetch(`${API_BASE}/remove?userId=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ productId: Number(productId) }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Error al eliminar del carrito");
  }
  return res.json();
}

export async function emptyCart(userId?: number) {
  const id = userId || getUserId();
  if (!id) throw new Error("No hay usuario logueado");
  const token = getToken();
  const res = await fetch(`${API_BASE}/empty?userId=${id}`, {
    method: "POST",
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Error al vaciar el carrito");
  }
  return res.json();
}