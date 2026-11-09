import { connection } from "next/server";
import { getDb } from "./db";
import type { Cart } from "./cart";

// Todas las lecturas llaman a connection(): SQLite es síncrono y, sin esto,
// Next.js ejecutaría la consulta durante el build y congelaría stock y precios.

export type Product = {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  stock: number;
  category: string;
  image_url: string | null;
};

const PRODUCT_COLUMNS = "id, name, description, price_cents, stock, category, image_url";

export async function getProducts(filters: { q?: string; category?: string } = {}): Promise<Product[]> {
  await connection();
  const where: string[] = [];
  const args: string[] = [];
  if (filters.q) {
    where.push("(name LIKE ? OR description LIKE ?)");
    args.push(`%${filters.q}%`, `%${filters.q}%`);
  }
  if (filters.category) {
    where.push("category = ?");
    args.push(filters.category);
  }
  const sql = `SELECT ${PRODUCT_COLUMNS} FROM products
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY (stock = 0), id DESC`;
  return getDb().prepare(sql).all(...args) as Product[];
}

export async function getProduct(id: number): Promise<Product | null> {
  await connection();
  if (!Number.isInteger(id) || id <= 0) return null;
  const row = getDb().prepare(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ?`).get(id);
  return (row as Product | undefined) ?? null;
}

export async function getCategories(): Promise<string[]> {
  await connection();
  const rows = getDb().prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as {
    category: string;
  }[];
  return rows.map((r) => r.category);
}

export type CartLine = { product: Product; quantity: number; subtotal_cents: number };

export async function getCartLines(cart: Cart): Promise<CartLine[]> {
  await connection();
  const ids = Object.keys(cart).map(Number);
  if (ids.length === 0) return [];
  const rows = getDb()
    .prepare(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id IN (${ids.map(() => "?").join(",")})`)
    .all(...ids) as Product[];
  return rows.map((product) => {
    const quantity = cart[product.id];
    return { product, quantity, subtotal_cents: quantity * product.price_cents };
  });
}

export type OrderSummary = { id: number; total_cents: number; created_at: string; items: number };

export async function getOrdersForUser(userId: number): Promise<OrderSummary[]> {
  await connection();
  return getDb()
    .prepare(
      `SELECT o.id, o.total_cents, o.created_at, COALESCE(SUM(i.quantity), 0) AS items
       FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
       WHERE o.user_id = ? GROUP BY o.id ORDER BY o.id DESC`,
    )
    .all(userId) as OrderSummary[];
}

export type OrderDetail = {
  id: number;
  total_cents: number;
  created_at: string;
  items: { product_id: number; product_name: string; unit_price_cents: number; quantity: number }[];
};

/** Solo devuelve el pedido si pertenece a ese usuario. */
export async function getOrder(orderId: number, userId: number): Promise<OrderDetail | null> {
  await connection();
  const db = getDb();
  const order = db
    .prepare("SELECT id, total_cents, created_at FROM orders WHERE id = ? AND user_id = ?")
    .get(orderId, userId) as Omit<OrderDetail, "items"> | undefined;
  if (!order) return null;
  const items = db
    .prepare(
      "SELECT product_id, product_name, unit_price_cents, quantity FROM order_items WHERE order_id = ? ORDER BY id",
    )
    .all(orderId) as OrderDetail["items"];
  return { ...order, items };
}
