"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { addToCart } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";

export function AddToCartForm({ productId, stock }: { productId: number; stock: number }) {
  const [state, action] = useActionState(addToCart, undefined);
  const [qty, setQty] = useState(1);

  if (stock === 0) {
    return (
      <button disabled className="w-full rounded-xl bg-zinc-200 py-4 font-semibold text-zinc-500">
        Agotado
      </button>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={qty} />
      <div className="flex gap-3">
        <div className="flex items-center rounded-xl ring-1 ring-zinc-300">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-14 w-12 text-xl text-zinc-600 hover:text-zinc-900"
            aria-label="Restar uno"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            className="h-14 w-12 text-xl text-zinc-600 hover:text-zinc-900"
            aria-label="Sumar uno"
          >
            +
          </button>
        </div>
        <SubmitButton pendingText="Agregando…" className="h-14 flex-1 text-base">
          Agregar al carrito
        </SubmitButton>
      </div>
      {state?.ok && (
        <p className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.ok}
          <Link href="/carrito" className="font-semibold underline underline-offset-2">
            Ver carrito →
          </Link>
        </p>
      )}
      {state?.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
    </form>
  );
}
