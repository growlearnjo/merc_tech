import { cookies } from "next/headers";
import crypto from "node:crypto";
import { getDb } from "./db";

const SESSION_COOKIE = "mt_session";
const SESSION_DAYS = 30;

export type User = { id: number; name: string; email: string };

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Crea la sesión en la base y deja la cookie. Solo desde Server Actions. */
export async function startSession(userId: number): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  getDb()
    .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .run(sha256(token), userId, expires);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

/** Borra la sesión actual. Solo desde Server Actions. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
  store.delete(SESSION_COOKIE);
}

/** Usuario con sesión activa, o null. Lee cookies: úsalo dentro de <Suspense>. */
export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), Date.now()) as User | undefined;
  return row ? { id: row.id, name: row.name, email: row.email } : null;
}

/** Acepta solo rutas internas ("/carrito"), nunca URLs externas. */
export function safeNext(raw: FormDataEntryValue | string | null | undefined): string {
  const value = typeof raw === "string" ? raw : "";
  return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/";
}
