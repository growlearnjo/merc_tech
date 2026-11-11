import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getOrderForUser } from "@/lib/orders";
import { formatDate, formatSoles } from "@/lib/money";

export const metadata: Metadata = { title: "Pedido confirmado" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/pedido/${encodeURIComponent(id)}`);

  const orderId = Number(id);
  const order = Number.isInteger(orderId) ? getOrderForUser(orderId, user.id) : null;
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">¡Pedido registrado!</h1>
        <p className="mt-1 text-slate-600">
          Gracias, {user.name.split(" ")[0]}. Tu pedido <strong>#{order.id}</strong> quedó registrado el{" "}
          {formatDate(order.createdAt)}.
        </p>

        <ul className="mt-8 divide-y divide-slate-100 text-left">
          {order.items.map((it) => (
            <li key={it.productId} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                <span className="font-semibold">{it.quantity}×</span> {it.name}
              </span>
              <span className="shrink-0 font-medium">{formatSoles(it.unitPriceCents * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatSoles(order.totalCents)}</span>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm text-slate-600">
          <p><span className="font-medium text-slate-800">Entrega:</span> {order.address}</p>
          <p><span className="font-medium text-slate-800">Teléfono:</span> {order.phone}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Seguir comprando</Link>
          <Link href="/pedidos" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold">Ver mis pedidos</Link>
        </div>
      </div>
    </div>
  );
}
