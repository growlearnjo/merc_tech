import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getOrder } from "@/lib/data";
import { formatPEN } from "@/lib/money";
import { formatDate } from "@/lib/dates";

export default function OrderPage({ params, searchParams }: PageProps<"/pedidos/[id]">) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-zinc-200" />}>
        <OrderDetail params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrderDetail({
  params,
  searchParams,
}: Pick<PageProps<"/pedidos/[id]">, "params" | "searchParams">) {
  const [{ id }, sp, user] = await Promise.all([params, searchParams, getCurrentUser()]);
  if (!user) redirect(`/login?next=/pedidos/${encodeURIComponent(id)}`);
  const order = await getOrder(Number(id), user.id);
  if (!order) notFound();
  const isNew = sp.nuevo === "1";

  return (
    <>
      {isNew && (
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-lg sm:p-8">
          <p className="text-4xl">🎉</p>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">¡Gracias por tu compra, {user.name.split(" ")[0]}!</h1>
          <p className="mt-2 text-emerald-50">
            Registramos tu pedido #{order.id}. Te avisaremos cuando esté en camino.
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">Pedido #{order.id}</h2>
          <span className="text-sm text-zinc-500">{formatDate(order.created_at)}</span>
        </div>

        <ul className="mt-4 divide-y divide-zinc-100">
          {order.items.map((item) => (
            <li key={item.product_id} className="flex justify-between gap-4 py-3 text-sm">
              <div>
                <Link href={`/productos/${item.product_id}`} className="font-medium hover:text-indigo-600">
                  {item.product_name}
                </Link>
                <p className="text-zinc-500">
                  {item.quantity} × {formatPEN(item.unit_price_cents)}
                </p>
              </div>
              <span className="font-semibold">{formatPEN(item.quantity * item.unit_price_cents)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex justify-between border-t border-zinc-200 pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatPEN(order.total_cents)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="flex-1 rounded-xl bg-zinc-900 py-3 text-center font-semibold text-white hover:bg-indigo-600">
          Seguir comprando
        </Link>
        <Link href="/pedidos" className="flex-1 rounded-xl bg-white py-3 text-center font-semibold ring-1 ring-zinc-300 hover:ring-zinc-500">
          Ver mis pedidos
        </Link>
      </div>
    </>
  );
}
