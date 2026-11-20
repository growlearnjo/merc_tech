"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import {
  endSession,
  getCurrentUser,
  hashPassword,
  safeNext,
  startSession,
  verifyPassword,
} from "@/lib/auth";
import { OrderError, placeOrder, type OrderLine } from "@/lib/orders";
import { insertProduct } from "@/lib/products";
import { parseSolesToCents } from "@/lib/money";
import { PRODUCT_NAME_MAX_LENGTH } from "@/lib/constants";

export type FormState = { error?: string; ok?: string; orderId?: number } | undefined;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

// ---------- Cuentas ----------

export async function registerAction(_: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  if (name.length < 2) return { error: "Ingresa tu nombre." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "El correo no es válido." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const db = getDb();
  const exists = db.prepare("SELECT 1 FROM users WHERE email = ?").get(email);
  if (exists) return { error: "Ya existe una cuenta con ese correo. Inicia sesión." };

  const res = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name, email, hashPassword(password));
  await startSession(Number(res.lastInsertRowid));
  redirect(safeNext(fd.get("next")));
}

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  const user = getDb()
    .prepare("SELECT id, password_hash AS hash FROM users WHERE email = ?")
    .get(email) as { id: number; hash: string } | undefined;
  if (!user || !verifyPassword(password, user.hash)) {
    return { error: "Correo o contraseña incorrectos." };
  }
  await startSession(user.id);
  redirect(safeNext(fd.get("next")));
}

export async function logoutAction() {
  await endSession();
  redirect("/");
}

// ---------- Compra ----------

function parseCart(raw: string): OrderLine[] | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(data) || data.length === 0 || data.length > 100) return null;
  const merged = new Map<number, number>();
  for (const item of data) {
    const id = Number(item?.id);
    const qty = Number(item?.qty);
    if (!Number.isInteger(id) || !Number.isInteger(qty) || qty < 1 || qty > 99) return null;
    merged.set(id, (merged.get(id) ?? 0) + qty);
  }
  return [...merged].map(([productId, quantity]) => ({ productId, quantity }));
}

export async function checkoutAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Inicia sesión para terminar tu compra." };

  const lines = parseCart(String(fd.get("items") ?? ""));
  if (!lines) return { error: "Tu carrito está vacío o no es válido." };

  const address = str(fd, "address");
  const phone = str(fd, "phone");
  if (address.length < 5) return { error: "Ingresa una dirección de entrega." };
  if (!/^[\d\s+()-]{6,20}$/.test(phone)) return { error: "Ingresa un teléfono válido." };

  try {
    const orderId = placeOrder(user.id, lines, { address, phone });
    revalidatePath("/", "layout");
    return { orderId };
  } catch (err) {
    if (err instanceof OrderError) return { error: err.message };
    throw err;
  }
}

// ---------- Administración de productos ----------

export async function createProductAction(_: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const description = str(fd, "description");
  const category = str(fd, "newCategory") || str(fd, "category");
  const priceCents = parseSolesToCents(str(fd, "price"));
  const stock = Number(str(fd, "stock"));
  const imageUrl = str(fd, "imageUrl") || null;

  if (name.length < 2 || name.length > PRODUCT_NAME_MAX_LENGTH) {
    return { error: `El nombre debe tener entre 2 y ${PRODUCT_NAME_MAX_LENGTH} caracteres.` };
  }
  if (!category) return { error: "Elige o escribe una categoría." };
  if (priceCents === null || priceCents <= 0) return { error: "El precio no es válido (ej. 1299.90)." };
  if (!Number.isInteger(stock) || stock < 0) return { error: "El stock debe ser un número entero, 0 o más." };
  if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl)) {
    return { error: "La imagen debe ser una URL que empiece con http:// o https://" };
  }

  const id = insertProduct({ name, description, category, priceCents, stock, imageUrl });
  revalidatePath("/", "layout");
  return { ok: `Producto "${name}" creado (#${id}).` };
}
