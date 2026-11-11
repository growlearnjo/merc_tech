"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/carrito"
      aria-label={`Carrito (${count} productos)`}
      className="relative grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
        <circle cx="9" cy="20" r="1.2" />
        <circle cx="18" cy="20" r="1.2" />
        <path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21.5 8H6" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
