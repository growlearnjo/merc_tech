import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/orders";
import { formatDate, formatSoles } from "@/lib/money";

export const metadata: Metadata = { title: "Mis pedidos" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/pedidos");
  const orders = listOrdersForUser(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl">Mis pedidos</h1>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-medium">Todavía no tienes pedidos.</p>
          <Link href="/" className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:underline">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/pedido/${o.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Pedido #{o.id}</span>
                  <span className="font-bold">{formatSoles(o.totalCents)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{formatDate(o.createdAt)}</p>
                <p className="mt-2 line-clamp-1 text-sm text-slate-700">
                  {o.items.map((i) => `${i.quantity}× ${i.name}`).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
