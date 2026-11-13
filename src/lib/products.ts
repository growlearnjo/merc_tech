import { getDb, queryAll, queryOne } from "./db";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
};

const COLUMNS = `id, name, description, category, price_cents AS priceCents,
  stock, image_url AS imageUrl`;

export function listProducts(opts: { q?: string; category?: string } = {}): Product[] {
  const where: string[] = [];
  const params: string[] = [];
  if (opts.q) {
    where.push("(name LIKE ? OR description LIKE ?)");
    params.push(`%${opts.q}%`, `%${opts.q}%`);
  }
  if (opts.category) {
    where.push("category = ?");
    params.push(opts.category);
  }
  return queryAll<Product>(
    `SELECT ${COLUMNS} FROM products
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY id`,
    ...params
  );
}

export function getProduct(id: number): Product | null {
  return queryOne<Product>(`SELECT ${COLUMNS} FROM products WHERE id = ?`, id);
}

export function listCategories(): string[] {
  return queryAll<{ category: string }>(
    "SELECT DISTINCT category FROM products ORDER BY category"
  ).map((r) => r.category);
}

export function insertProduct(p: Omit<Product, "id">): number {
  const result = getDb()
    .prepare(
      `INSERT INTO products (name, description, category, price_cents, stock, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(p.name, p.description, p.category, p.priceCents, p.stock, p.imageUrl);
  return Number(result.lastInsertRowid);
}
