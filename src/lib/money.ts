const soles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

/** 349900 -> "S/ 3,499.00" */
export function formatSoles(cents: number): string {
  return soles.format(cents / 100);
}

/** "1299.90" o "1299,90" -> 129990. Devuelve null si no es un monto válido. */
export function parseSolesToCents(input: string): number | null {
  const normalized = input.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}

/** Fechas de SQLite (UTC) mostradas en hora de Lima. */
export function formatDate(sqliteUtc: string): string {
  const d = new Date(sqliteUtc.replace(" ", "T") + "Z");
  return d.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
