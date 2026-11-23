// Quién administra la tienda: los correos de la variable de entorno ADMIN_EMAILS,
// separados por coma. Vive en .env.local, fuera del repositorio.
// Sin la variable, nadie es administrador: falla cerrado.

/** Dice si un correo está en la lista de administradores. Sin lista, siempre false. */
export function isAdminEmail(email: string, adminEmails: string | undefined): boolean {
  if (!email || !adminEmails) return false;
  const lista = adminEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return lista.includes(email.trim().toLowerCase());
}
