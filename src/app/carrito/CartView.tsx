"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { Alert, Field, SubmitButton } from "@/components/ui";
import { checkoutAction } from "@/app/actions";
import { formatSoles } from "@/lib/money";
import { useKeepValuesSubmit } from "@/components/useKeepValuesSubmit";

export function CartView({ userName }: { userName: string | null }) {
  const { items, ready, totalCents, setQty, remove, clear } = useCart();
  const [state, formAction, pending] = useActionState(checkoutAction, undefined);
  const onSubmit = useKeepValuesSubmit(formAction);
  const router = useRouter();

  useEffect(() => {
    if (state?.orderId) {
      clear();
      router.push(`/pedido/${state.orderId}`);
    }
  }, [state, clear, router]);

  if (!ready) return <div className="h-40 animate-pulse rounded-2xl bg-slate-200/60" />;

  if (items.length === 0 && !state?.orderId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-4xl">🛒</p>
        <p className="mt-3 font-semibold">Tu carrito está vacío</p>
        <p className="mt-1 text-sm text-slate-500">Explora el catálogo y agrega lo que te guste.</p>
        <Link href="/" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:gap-4 sm:p-4">
            <Link href={`/producto/${item.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
              <ProductImage name={item.name} category={item.category} imageUrl={item.imageUrl} />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/producto/${item.id}`} className="line-clamp-2 font-semibold leading-snug hover:text-indigo-600">
                  {item.name}
                </Link>
                <button
                  onClick={() => remove(item.id)}
                  aria-label={`Quitar ${item.name}`}
                  className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <span className="text-sm text-slate-500">{formatSoles(item.priceCents)} c/u</span>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button
                    onClick={() => setQty(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    aria-label="Restar uno"
                    className="h-9 w-9 text-lg disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.id, item.qty + 1)}
                    disabled={item.qty >= item.stock}
                    aria-label="Sumar uno"
                    className="h-9 w-9 text-lg disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold">{formatSoles(item.priceCents * item.qty)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatSoles(totalCents)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-slate-600">
          <span>Envío</span>
          <span className="text-emerald-600">Gratis</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatSoles(totalCents)}</span>
        </div>

        {userName ? (
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <input
              type="hidden"
              name="items"
              value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))}
            />
            <Field label="Dirección de entrega" name="address" required placeholder="Av. Arequipa 1234, Miraflores" autoComplete="street-address" />
            <Field label="Teléfono" name="phone" type="tel" required placeholder="987 654 321" autoComplete="tel" />
            {state?.error && <Alert kind="error">{state.error}</Alert>}
            <SubmitButton pending={pending || !!state?.orderId}>Confirmar pedido</SubmitButton>
            <p className="text-center text-xs text-slate-500">
              No se realiza ningún cobro: el pedido queda registrado y se reserva el stock.
            </p>
          </form>
        ) : (
          <div className="mt-5 space-y-3">
            <p className="text-sm text-slate-600">Para terminar tu compra necesitas una cuenta.</p>
            <Link
              href="/login?next=/carrito"
              className="block rounded-xl bg-indigo-600 py-3.5 text-center font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro?next=/carrito"
              className="block rounded-xl border border-slate-300 py-3.5 text-center font-semibold text-slate-800 hover:bg-slate-50"
            >
              Crear cuenta
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
