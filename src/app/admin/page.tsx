import Link from "next/link";
import type { Metadata } from "next";
import { listCategories, listProducts } from "@/lib/products";
import { formatSoles } from "@/lib/money";
import { ProductForm } from "./ProductForm";

export const metadata: Metadata = { title: "Cargar productos" };
export const dynamic = "force-dynamic";

// NOTA: página abierta, sin control de permisos (pedido explícito para la demo).
export default function AdminPage() {
  const products = listProducts();
  const categories = listCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Cargar productos</h1>
      <p className="mt-1 text-slate-500">Los productos nuevos aparecen al instante en el catálogo.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <ProductForm categories={categories} />

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <h2 className="border-b border-slate-200 px-4 py-3 font-semibold">
            Inventario <span className="font-normal text-slate-500">({products.length})</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Producto</th>
                  <th className="px-4 py-2 font-medium">Categoría</th>
                  <th className="px-4 py-2 text-right font-medium">Precio</th>
                  <th className="px-4 py-2 text-right font-medium">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <Link href={`/producto/${p.id}`} className="font-medium hover:text-indigo-600">
                        {p.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-slate-600">{p.category}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right">{formatSoles(p.priceCents)}</td>
                    <td
                      className={`px-4 py-2.5 text-right font-semibold tabular-nums ${
                        p.stock === 0 ? "text-rose-600" : p.stock <= 5 ? "text-amber-600" : ""
                      }`}
                    >
                      {p.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
