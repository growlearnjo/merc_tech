const formatter = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Lima",
});

/** SQLite guarda datetime('now') en UTC como "2026-11-09 15:04:05". */
export function formatDate(sqliteUtc: string): string {
  return formatter.format(new Date(`${sqliteUtc.replace(" ", "T")}Z`));
}
