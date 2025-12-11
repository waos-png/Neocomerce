const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
const API_BASE = `${BASE.replace(/\/$/,'')}/cart/`;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sellerToken") || localStorage.getItem("token") || null;
}

export async function fetchCart(userId: number) {
  if (!userId) throw new Error("fetchCart requiere userId");
  const url = `${API_BASE}?userId=${userId}`;
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

export async function addToCart(productId: string, quantity: number = 1, userId?: number) {
  if (!userId) throw new Error("addToCart requiere userId");
  const token = getToken();
  const res = await fetch(`${API_BASE}add?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Error al agregar al carrito");
  }
  return res.json();
}

export async function removeFromCart(productId: string, userId?: number) {
  if (!userId) throw new Error("removeFromCart requiere userId");
  const token = getToken();
  const res = await fetch(`${API_BASE}remove?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Error al eliminar del carrito");
  }
  return res.json();
}

export async function emptyCart(userId?: number) {
  if (!userId) throw new Error("emptyCart requiere userId");
  const token = getToken();
  const res = await fetch(`${API_BASE}empty?userId=${userId}`, {
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