import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Carrito" };

export default async function CartPage() {
  const user = await getCurrentUser();
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl">Tu carrito</h1>
      <CartView userName={user?.name ?? null} />
    </div>
  );
}
