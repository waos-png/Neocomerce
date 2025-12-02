const API_BASE = "https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/cart/";

export async function fetchCart() {
  const res = await fetch(API_BASE, { credentials: "include" });
  if (!res.ok) throw new Error("Error al cargar el carrito");
  return res.json();
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