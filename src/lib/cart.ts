import { cookies } from "next/headers";

// El carrito vive en una cookie: { [productId]: cantidad }.
// Precios y stock siempre se leen de la base, nunca de la cookie.
const CART_COOKIE = "mt_cart";

export type Cart = Record<number, number>;

export async function readCart(): Promise<Cart> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const cart: Cart = {};
    for (const [key, value] of Object.entries(parsed)) {
      const id = Number(key);
      const qty = Number(value);
      if (Number.isInteger(id) && id > 0 && Number.isInteger(qty) && qty > 0) cart[id] = qty;
    }
    return cart;
  } catch {
    return {};
  }
}

/** Solo desde Server Actions. */
export async function writeCart(cart: Cart): Promise<void> {
  const store = await cookies();
  if (Object.keys(cart).length === 0) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}
