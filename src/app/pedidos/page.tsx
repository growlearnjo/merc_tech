import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data";
import { formatPEN } from "@/lib/money";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Mis pedidos" };

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Mis pedidos</h1>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-zinc-200" />}>
        <OrdersList />
      </Suspense>
    </div>
  );
}

async function OrdersList() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/pedidos");
  const orders = await getOrdersForUser(user.id);

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-zinc-200">
        <p className="text-4xl">📦</p>
        <p className="mt-3 font-semibold">Aún no tienes pedidos.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-indigo-600">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link
            href={`/pedidos/${o.id}`}
            className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-zinc-200 transition hover:ring-indigo-400"
          >
            <div>
              <p className="font-semibold">Pedido #{o.id}</p>
              <p className="text-sm text-zinc-500">
                {formatDate(o.created_at)} · {o.items} {o.items === 1 ? "producto" : "productos"}
              </p>
            </div>
            <span className="font-bold">{formatPEN(o.total_cents)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
