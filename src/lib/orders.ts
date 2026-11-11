import { getDb, queryAll, queryOne, transaction } from "./db";

export type OrderLine = { productId: number; quantity: number };

export class OrderError extends Error {}

type ProductRow = { id: number; name: string; priceCents: number; stock: number };

/**
 * Registra el pedido y descuenta stock en una sola transacción.
 * Los precios salen de la base, nunca del navegador.
 */
export function placeOrder(
  userId: number,
  lines: OrderLine[],
  shipping: { address: string; phone: string }
): number {
  const db = getDb();
  return transaction(db, () => {
    const findProduct = db.prepare(
      "SELECT id, name, price_cents AS priceCents, stock FROM products WHERE id = ?"
    );
    const resolved = lines.map((line) => {
      const p = findProduct.get(line.productId) as unknown as ProductRow | undefined;
      if (!p) throw new OrderError("Un producto de tu carrito ya no está disponible.");
      if (p.stock < line.quantity) {
        throw new OrderError(
          p.stock === 0
            ? `"${p.name}" se agotó. Quítalo del carrito para continuar.`
            : `Solo quedan ${p.stock} unidades de "${p.name}".`
        );
      }
      return { ...p, quantity: line.quantity };
    });

    const total = resolved.reduce((sum, p) => sum + p.priceCents * p.quantity, 0);
    const order = db
      .prepare("INSERT INTO orders (user_id, total_cents, address, phone) VALUES (?, ?, ?, ?)")
      .run(userId, total, shipping.address, shipping.phone);
    const orderId = Number(order.lastInsertRowid);

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
       VALUES (?, ?, ?, ?, ?)`
    );
    const decrement = db.prepare(
      "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?"
    );
    for (const p of resolved) {
      insertItem.run(orderId, p.id, p.name, p.priceCents, p.quantity);
      const res = decrement.run(p.quantity, p.id, p.quantity);
      if (Number(res.changes) !== 1) throw new OrderError(`Sin stock suficiente de "${p.name}".`);
    }
    return orderId;
  });
}

export type OrderSummary = {
  id: number;
  totalCents: number;
  address: string;
  phone: string;
  createdAt: string;
  items: { productId: number; name: string; unitPriceCents: number; quantity: number }[];
};

const ORDER_COLUMNS = "id, total_cents AS totalCents, address, phone, created_at AS createdAt";

function loadItems(orderId: number) {
  return queryAll<OrderSummary["items"][number]>(
    `SELECT product_id AS productId, product_name AS name,
            unit_price_cents AS unitPriceCents, quantity
     FROM order_items WHERE order_id = ? ORDER BY id`,
    orderId
  );
}

/** Devuelve el pedido solo si pertenece al usuario. */
export function getOrderForUser(orderId: number, userId: number): OrderSummary | null {
  const row = queryOne<Omit<OrderSummary, "items">>(
    `SELECT ${ORDER_COLUMNS} FROM orders WHERE id = ? AND user_id = ?`,
    orderId,
    userId
  );
  return row ? { ...row, items: loadItems(row.id) } : null;
}

export function listOrdersForUser(userId: number): OrderSummary[] {
  return queryAll<Omit<OrderSummary, "items">>(
    `SELECT ${ORDER_COLUMNS} FROM orders WHERE user_id = ? ORDER BY id DESC`,
    userId
  ).map((r) => ({ ...r, items: loadItems(r.id) }));
}
