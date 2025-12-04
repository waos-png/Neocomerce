const API_BASE = "https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/cart/";

export async function fetchCart() {
  const url = API_BASE;
  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include", // si realmente necesitas cookies
      headers: {
        "Accept": "application/json",
      },
      // mode: 'cors' // opcional, por defecto es 'cors' en cross-origin
    });
    if (!res.ok) {
      // try to read body for message
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${body || res.statusText}`);
    }
    return res.json();
  } catch (err) {
    // logueo más detallado
    console.error("[fetchCart] falló petición a", url, err);
    // lanzar para que el contexto lo capture y lo muestre si quieres
    throw err;
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  const res = await fetch(`${API_BASE}add/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error("Error al agregar al carrito");
  return res.json();
}

export async function removeFromCart(productId: string) {
  const res = await fetch(`${API_BASE}remove/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ product_id: productId }),
  });
  if (!res.ok) throw new Error("Error al eliminar del carrito");
  return res.json();
}

export async function emptyCart() {
  const res = await fetch(`${API_BASE}empty/`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al vaciar el carrito");
  return res.json();
}