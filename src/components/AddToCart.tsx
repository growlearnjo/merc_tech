"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export function AddToCart({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.id === product.id)?.qty ?? 0;
  const available = product.stock - inCart;

  if (product.stock === 0) {
    return (
      <button disabled className="w-full rounded-xl bg-slate-200 py-3.5 font-semibold text-slate-500">
        Agotado
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex items-center rounded-xl border border-slate-300 bg-white">
          <button
            type="button"
            aria-label="Restar uno"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-12 w-11 text-xl text-slate-600 disabled:opacity-30"
            disabled={qty <= 1}
          >
            −
          </button>
          <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label="Sumar uno"
            onClick={() => setQty((q) => Math.min(Math.max(available, 1), q + 1))}
            className="h-12 w-11 text-xl text-slate-600 disabled:opacity-30"
            disabled={qty >= available}
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={available <= 0}
          onClick={() => {
            add(
              {
                id: product.id,
                name: product.name,
                category: product.category,
                priceCents: product.priceCents,
                stock: product.stock,
                imageUrl: product.imageUrl,
              },
              qty
            );
            setQty(1);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="flex-1 rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
        >
          {added ? "¡Agregado! ✓" : available <= 0 ? "Ya tienes todo el stock" : "Agregar al carrito"}
        </button>
      </div>
      {inCart > 0 && (
        <p className="text-sm text-slate-600">
          Tienes {inCart} en tu carrito ·{" "}
          <Link href="/carrito" className="font-semibold text-indigo-600 hover:underline">
            Ver carrito
          </Link>
        </p>
      )}
    </div>
  );
}
