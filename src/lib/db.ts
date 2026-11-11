// Acceso a SQLite con el módulo integrado de Node (node:sqlite).
// No requiere instalar nada aparte: la base vive en data/tienda.db y se crea
// (con los productos de ejemplo) la primera vez que se usa.
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { SEED_PRODUCTS } from "./seed";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "tienda.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  image_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total_cents INTEGER NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`;

// node:sqlite devuelve objetos sin prototipo, que React no puede enviar a
// componentes cliente. Estas funciones devuelven objetos normales.
type Params = (string | number | null)[];

export function queryAll<T>(sql: string, ...params: Params): T[] {
  return getDb()
    .prepare(sql)
    .all(...params)
    .map((row) => ({ ...row }) as T);
}

export function queryOne<T>(sql: string, ...params: Params): T | null {
  const row = getDb().prepare(sql).get(...params);
  return row ? ({ ...row } as T) : null;
}

/** Ejecuta fn dentro de una transacción con bloqueo de escritura. */
export function transaction<T>(db: DatabaseSync, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

function seed(db: DatabaseSync) {
  transaction(db, () => {
    const row = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
    if (row.n > 0) return;
    const insert = db.prepare(
      "INSERT INTO products (name, description, category, price_cents, stock) VALUES (?, ?, ?, ?, ?)"
    );
    for (const p of SEED_PRODUCTS) {
      insert.run(p.name, p.description, p.category, p.priceCents, p.stock);
    }
  });
}

function open(): DatabaseSync {
  fs.mkdirSync(DB_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  seed(db);
  return db;
}

// Una sola conexión por proceso (también entre recargas en modo dev).
const globalForDb = globalThis as unknown as { __tiendaDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (!globalForDb.__tiendaDb) globalForDb.__tiendaDb = open();
  return globalForDb.__tiendaDb;
}
