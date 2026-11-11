import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions";
import { CartButton } from "./CartButton";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path d="M13 2 4 14h7l-1 8 9-12h-7z" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-lg">
            Volt<span className="text-indigo-600">Tech</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link href="/admin" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 sm:block">
            Cargar productos
          </Link>
          {user ? (
            <>
              <Link href="/pedidos" className="rounded-lg px-2 py-2 text-slate-600 hover:bg-slate-100 sm:px-3">
                <span className="hidden sm:inline">Hola, {user.name.split(" ")[0]} · </span>Mis pedidos
              </Link>
              <form action={logoutAction}>
                <button className="rounded-lg px-2 py-2 text-slate-500 hover:bg-slate-100 sm:px-3">Salir</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100">
              Ingresar
            </Link>
          )}
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
