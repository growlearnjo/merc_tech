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

export const PAGE_SIZE = 6;

type ProductFilter = { q?: string; category?: string };

function buildWhere(opts: ProductFilter): { sql: string; params: string[] } {
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
  return { sql: where.length ? "WHERE " + where.join(" AND ") : "", params };
}

export function listProducts(opts: ProductFilter = {}): Product[] {
  const { sql, params } = buildWhere(opts);
  return queryAll<Product>(`SELECT ${COLUMNS} FROM products ${sql} ORDER BY id`, ...params);
}

export type ProductPage = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
};

// Devuelve una página del catálogo. Si `page` se pasa del final, se ajusta a la última.
export function listProductsPage(opts: ProductFilter & { page?: number } = {}): ProductPage {
  const { sql, params } = buildWhere(opts);
  const total =
    queryOne<{ n: number }>(`SELECT COUNT(*) AS n FROM products ${sql}`, ...params)?.n ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(opts.page ?? 1)), totalPages);
  const products = queryAll<Product>(
    `SELECT ${COLUMNS} FROM products ${sql} ORDER BY id LIMIT ? OFFSET ?`,
    ...params,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE
  );
  return { products, total, page, totalPages };
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
