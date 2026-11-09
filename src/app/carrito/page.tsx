import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { readCart } from "@/lib/cart";
import { getCartLines } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { formatPEN } from "@/lib/money";
import { checkout, removeFromCart, updateCartItem } from "@/app/actions";
import { ProductImage } from "@/components/ProductImage";
import { SubmitButton } from "@/components/SubmitButton";
import { ActionForm } from "@/components/ActionForm";

export const metadata: Metadata = { title: "Carrito" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Tu carrito</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />}>
        <CartContent />
      </Suspense>
    </div>
  );
}

async function CartContent() {
  const [cart, user] = await Promise.all([readCart(), getCurrentUser()]);
  const lines = await getCartLines(cart);

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-zinc-200">
        <p className="text-5xl">🛒</p>
        <p className="mt-4 text-lg font-semibold">Tu carrito está vacío</p>
        <p className="mt-1 text-zinc-500">Explora el catálogo y agrega lo que te guste.</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white hover:bg-indigo-600">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const total = lines.reduce((sum, l) => sum + l.subtotal_cents, 0);
  const units = lines.reduce((sum, l) => sum + l.quantity, 0);
  const hasProblems = lines.some((l) => l.quantity > l.product.stock);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <ul className="space-y-3">
        {lines.map(({ product, quantity, subtotal_cents }) => {
          const tooMany = quantity > product.stock;
          return (
            <li key={product.id} className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-zinc-200 sm:gap-4 sm:p-4">
              <Link href={`/productos/${product.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                <ProductImage name={product.name} category={product.category} imageUrl={product.image_url} size="sm" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/productos/${product.id}`} className="line-clamp-2 font-semibold leading-snug hover:text-indigo-600">
                    {product.name}
                  </Link>
                  <form action={removeFromCart}>
                    <input type="hidden" name="productId" value={product.id} />
                    <SubmitButton variant="ghost" className="-mr-1 -mt-1 p-1 text-sm">
                      <span aria-hidden>✕</span>
                      <span className="sr-only">Quitar</span>
                    </SubmitButton>
                  </form>
                </div>
                <p className="text-sm text-zinc-500">{formatPEN(product.price_cents)} c/u</p>
                {tooMany && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {product.stock === 0 ? "Agotado: quítalo para continuar" : `Solo quedan ${product.stock}`}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="flex items-center rounded-lg ring-1 ring-zinc-300">
                    <QtyButton productId={product.id} quantity={quantity - 1} label="−" />
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                    <QtyButton
                      productId={product.id}
                      quantity={quantity + 1}
                      label="+"
                      disabled={quantity >= product.stock}
                    />
                  </div>
                  <span className="font-bold">{formatPEN(subtotal_cents)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-zinc-200 lg:sticky lg:top-24">
        <h2 className="font-semibold">Resumen</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Productos ({units})</dt>
            <dd>{formatPEN(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Envío</dt>
            <dd className="font-medium text-emerald-600">Gratis</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-100 pt-3 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatPEN(total)}</dd>
          </div>
        </dl>

        <div className="mt-5">
          {user ? (
            <ActionForm action={checkout} className="space-y-3">
              <SubmitButton pendingText="Procesando…" className="h-14 w-full text-base">
                Finalizar compra
              </SubmitButton>
              {hasProblems && (
                <p className="text-xs text-red-600">Ajusta las cantidades marcadas en rojo antes de comprar.</p>
              )}
              <p className="text-center text-xs text-zinc-500">Demo: no se realiza ningún cobro.</p>
            </ActionForm>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login?next=/carrito"
                className="flex h-14 w-full items-center justify-center rounded-xl bg-zinc-900 font-semibold text-white hover:bg-indigo-600"
              >
                Inicia sesión para comprar
              </Link>
              <p className="text-center text-sm text-zinc-500">
                ¿No tienes cuenta?{" "}
                <Link href="/registro?next=/carrito" className="font-semibold text-indigo-600">
                  Regístrate
                </Link>
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function QtyButton({
  productId,
  quantity,
  label,
  disabled,
}: {
  productId: number;
  quantity: number;
  label: string;
  disabled?: boolean;
}) {
  return (
    <form action={updateCartItem}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      <button
        type="submit"
        disabled={disabled}
        className="h-9 w-9 text-lg text-zinc-600 hover:text-zinc-900 disabled:text-zinc-300"
        aria-label={label === "+" ? "Sumar uno" : "Restar uno"}
      >
        {label}
      </button>
    </form>
  );
}
