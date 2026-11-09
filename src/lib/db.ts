import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// La base vive dentro del proyecto: data/tienda.db (se crea sola la primera vez).
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "tienda.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  stock       INTEGER NOT NULL CHECK (stock >= 0),
  category    TEXT    NOT NULL,
  image_url   TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  total_cents INTEGER NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id         INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       INTEGER NOT NULL REFERENCES products(id),
  product_name     TEXT    NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity         INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`;

type SeedProduct = {
  name: string;
  description: string;
  price: number; // en soles
  stock: number;
  category: string;
};

const SEED: SeedProduct[] = [
  {
    name: 'Laptop UltraBook Pro 14"',
    description:
      "Procesador Ryzen 7, 16 GB de RAM y SSD de 512 GB. Pantalla 2.8K de 120 Hz y batería para toda la jornada en solo 1.3 kg.",
    price: 3499,
    stock: 8,
    category: "Laptops",
  },
  {
    name: 'Laptop Gamer Titan 15.6"',
    description:
      "Intel Core i7 de 13.ª generación, RTX 4060 de 8 GB, 16 GB de RAM y pantalla de 165 Hz. Teclado retroiluminado RGB.",
    price: 5299,
    stock: 5,
    category: "Laptops",
  },
  {
    name: "Smartphone Nova X 256 GB",
    description:
      'Pantalla AMOLED de 6.7", cámara principal de 108 MP, carga rápida de 67 W y 8 GB de RAM. Incluye funda.',
    price: 2199,
    stock: 15,
    category: "Celulares",
  },
  {
    name: "Smartphone Lite A5 128 GB",
    description:
      'Pantalla de 6.5" a 90 Hz, batería de 5000 mAh y doble cámara de 50 MP. El mejor precio-calidad.',
    price: 899,
    stock: 25,
    category: "Celulares",
  },
  {
    name: "Audífonos Pulse ANC",
    description:
      "Cancelación activa de ruido, 40 horas de batería, Bluetooth 5.3 y micrófono para llamadas nítidas.",
    price: 549,
    stock: 30,
    category: "Audio",
  },
  {
    name: "Parlante Bluetooth Boom Mini",
    description:
      "Sonido 360°, resistente al agua IP67 y 12 horas de reproducción. Ideal para llevar a todas partes.",
    price: 189.9,
    stock: 40,
    category: "Audio",
  },
  {
    name: 'Monitor 27" QHD 165 Hz',
    description:
      "Panel IPS de 2560×1440, 1 ms de respuesta, HDR10 y soporte ajustable en altura. Perfecto para trabajo y juego.",
    price: 1249,
    stock: 10,
    category: "Monitores",
  },
  {
    name: "Teclado mecánico RGB TKL",
    description:
      "Switches intercambiables en caliente, formato sin pad numérico, iluminación RGB por tecla y cable USB-C desmontable.",
    price: 279,
    stock: 22,
    category: "Gaming",
  },
  {
    name: "Mouse inalámbrico ergonómico",
    description:
      "Sensor de 4000 DPI, conexión dual Bluetooth y 2.4 GHz, y batería recargable que dura hasta 70 días.",
    price: 129.9,
    stock: 50,
    category: "Accesorios",
  },
  {
    name: 'Tablet Tab 11" 128 GB',
    description:
      "Pantalla 2K de 11 pulgadas, cuatro parlantes, 6 GB de RAM y compatibilidad con lápiz óptico.",
    price: 1399,
    stock: 12,
    category: "Tablets",
  },
  {
    name: "Smartwatch Fit Pro",
    description:
      "GPS integrado, monitor de ritmo cardiaco y oxígeno en sangre, más de 100 modos deportivos y 10 días de batería.",
    price: 459,
    stock: 18,
    category: "Smartwatch",
  },
  {
    name: "Cargador GaN 65 W USB-C",
    description:
      "Carga laptop, tablet y celular a la vez con sus tres puertos. Compacto y con protección contra sobrecalentamiento.",
    price: 119,
    stock: 3,
    category: "Accesorios",
  },
];

function open(): DatabaseSync {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);

  const { n } = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
  if (n === 0) {
    const insert = db.prepare(
      "INSERT INTO products (name, description, price_cents, stock, category) VALUES (?, ?, ?, ?, ?)",
    );
    transaction(db, () => {
      for (const p of SEED) {
        insert.run(p.name, p.description, Math.round(p.price * 100), p.stock, p.category);
      }
    });
  }
  return db;
}

/** Ejecuta fn dentro de una transacción; si lanza un error, deshace todo. */
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

// Una sola conexión por proceso (sobrevive a la recarga en caliente de `next dev`).
const globalForDb = globalThis as unknown as { __tiendaDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (!globalForDb.__tiendaDb) globalForDb.__tiendaDb = open();
  return globalForDb.__tiendaDb;
}
