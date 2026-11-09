const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

/** 129990 -> "S/ 1,299.90" */
export function formatPEN(cents: number): string {
  return formatter.format(cents / 100);
}

/** "1299.90" o "1,299.90" -> 129990. Devuelve null si no es un precio válido. */
export function parsePriceToCents(raw: string): number | null {
  const clean = raw.trim().replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
  const cents = Math.round(Number(clean) * 100);
  return cents > 0 ? cents : null;
}
