"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { getDb, transaction } from "@/lib/db";
import { readCart, writeCart } from "@/lib/cart";
import { endSession, getCurrentUser, hashPassword, safeNext, startSession, verifyPassword } from "@/lib/auth";
import { parsePriceToCents } from "@/lib/money";

export type FormState = { error?: string; ok?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function int(fd: FormData, key: string): number {
  const n = Number(str(fd, key));
  return Number.isInteger(n) ? n : NaN;
}

function stockOf(productId: number): { name: string; stock: number } | undefined {
  return getDb().prepare("SELECT name, stock FROM products WHERE id = ?").get(productId) as
    | { name: string; stock: number }
    | undefined;
}

/* ───────────────────────── Carrito ───────────────────────── */

export async function addToCart(_prev: FormState, fd: FormData): Promise<FormState> {
  const productId = int(fd, "productId");
  const quantity = int(fd, "quantity") || 1;
  const product = stockOf(productId);
  if (!product) return { error: "Este producto ya no existe." };
  if (product.stock === 0) return { error: "Producto agotado." };

  const cart = await readCart();
  const current = cart[productId] ?? 0;
  const next = Math.min(current + Math.max(1, quantity), product.stock);
  if (next === current) return { error: `Ya tienes las ${product.stock} unidades disponibles en el carrito.` };

  cart[productId] = next;
  await writeCart(cart);
  return { ok: next < current + quantity ? `Agregado (máximo disponible: ${product.stock}).` : "¡Agregado al carrito!" };
}

export async function updateCartItem(fd: FormData): Promise<void> {
  const productId = int(fd, "productId");
  const quantity = int(fd, "quantity");
  const cart = await readCart();
  if (!(productId in cart) || Number.isNaN(quantity)) return;

  const product = stockOf(productId);
  if (!product || quantity <= 0) delete cart[productId];
  else cart[productId] = Math.min(quantity, Math.max(product.stock, 1));
  await writeCart(cart);
}

export async function removeFromCart(fd: FormData): Promise<void> {
  const productId = int(fd, "productId");
  const cart = await readCart();
  delete cart[productId];
  await writeCart(cart);
}

/* ───────────────────────── Compra ───────────────────────── */

class CheckoutError extends Error {}

export async function checkout(): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/carrito");

  const cart = await readCart();
  const entries = Object.entries(cart).map(([id, qty]) => [Number(id), qty] as const);
  if (entries.length === 0) return { error: "Tu carrito está vacío." };

  const db = getDb();
  let orderId: number;
  try {
    orderId = transaction(db, () => {
      const getProduct = db.prepare("SELECT id, name, price_cents, stock FROM products WHERE id = ?");
      const lines = entries.map(([id, qty]) => {
        const p = getProduct.get(id) as
          | { id: number; name: string; price_cents: number; stock: number }
          | undefined;
        if (!p) throw new CheckoutError("Uno de los productos del carrito ya no existe. Quítalo para continuar.");
        if (p.stock < qty) {
          throw new CheckoutError(
            p.stock === 0
              ? `"${p.name}" se agotó. Quítalo del carrito para continuar.`
              : `Solo quedan ${p.stock} unidades de "${p.name}". Ajusta la cantidad.`,
          );
        }
        return { ...p, qty };
      });

      const total = lines.reduce((sum, l) => sum + l.price_cents * l.qty, 0);
      const { lastInsertRowid } = db
        .prepare("INSERT INTO orders (user_id, total_cents) VALUES (?, ?)")
        .run(user.id, total);
      const id = Number(lastInsertRowid);

      const decrement = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
      const addItem = db.prepare(
        "INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity) VALUES (?, ?, ?, ?, ?)",
      );
      for (const l of lines) {
        const { changes } = decrement.run(l.qty, l.id, l.qty);
        if (Number(changes) !== 1) throw new CheckoutError(`No hay stock suficiente de "${l.name}".`);
        addItem.run(id, l.id, l.name, l.price_cents, l.qty);
      }
      return id;
    });
  } catch (err) {
    if (err instanceof CheckoutError) return { error: err.message };
    throw err;
  }

  await writeCart({});
  redirect(`/pedidos/${orderId}?nuevo=1`);
}

/* ───────────────────────── Cuentas ───────────────────────── */

export async function register(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const password = typeof fd.get("password") === "string" ? (fd.get("password") as string) : "";

  if (name.length < 2) return { error: "Escribe tu nombre." };
  if (!EMAIL_RE.test(email)) return { error: "El correo no es válido." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const db = getDb();
  if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) {
    return { error: "Ya existe una cuenta con ese correo. Inicia sesión." };
  }
  const { lastInsertRowid } = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name, email, hashPassword(password));

  await startSession(Number(lastInsertRowid));
  redirect(safeNext(fd.get("next")));
}

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = typeof fd.get("password") === "string" ? (fd.get("password") as string) : "";

  const user = getDb().prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string }
    | undefined;
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await startSession(user.id);
  redirect(safeNext(fd.get("next")));
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/");
}

/* ───────────────────────── Administración ───────────────────────── */

export async function createProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const description = str(fd, "description");
  const category = str(fd, "category");
  const imageUrl = str(fd, "image_url");
  const priceCents = parsePriceToCents(str(fd, "price"));
  const stock = int(fd, "stock");

  if (name.length < 2) return { error: "El nombre es obligatorio." };
  if (priceCents === null) return { error: "Precio no válido. Usa un número como 1299.90" };
  if (Number.isNaN(stock) || stock < 0) return { error: "El stock debe ser un número entero (0 o más)." };
  if (category.length < 2) return { error: "Indica una categoría." };
  if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl)) {
    return { error: "La imagen debe ser una URL que empiece con http:// o https://" };
  }

  getDb()
    .prepare(
      "INSERT INTO products (name, description, price_cents, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(name, description, priceCents, stock, category, imageUrl || null);

  refresh();
  return { ok: `"${name}" ya está en el catálogo.` };
}
