import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { cartCount, readCart } from "@/lib/cart";
import { logout } from "@/app/actions";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-zinc-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg text-white shadow-sm">
            ⚡
          </span>
          <span className="text-lg">
            Mercado<span className="text-indigo-600">Tech</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/admin"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 sm:block"
          >
            Administrar
          </Link>
          <Suspense fallback={<div className="h-9 w-20" />}>
            <UserMenu />
          </Suspense>
          <Link
            href="/carrito"
            aria-label="Carrito"
            className="relative grid h-10 w-10 place-items-center rounded-xl text-zinc-700 hover:bg-zinc-100"
          >
            <CartIcon />
            <Suspense fallback={null}>
              <CartBadge />
            </Suspense>
          </Link>
        </nav>
      </div>
    </header>
  );
}

async function CartBadge() {
  const count = cartCount(await readCart());
  if (count === 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
      >
        Ingresar
      </Link>
    );
  }
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-100 [&::-webkit-details-marker]:hidden">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-medium text-zinc-700 sm:block">
          {user.name.split(" ")[0]}
        </span>
      </summary>
      <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-zinc-200">
        <p className="truncate border-b border-zinc-100 px-4 py-2 text-xs text-zinc-500">{user.email}</p>
        <Link href="/pedidos" className="block px-4 py-2.5 text-sm hover:bg-zinc-50">
          Mis pedidos
        </Link>
        <Link href="/admin" className="block px-4 py-2.5 text-sm hover:bg-zinc-50 sm:hidden">
          Administrar
        </Link>
        <form action={logout}>
          <button type="submit" className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
            Cerrar sesión
          </button>
        </form>
      </div>
    </details>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
