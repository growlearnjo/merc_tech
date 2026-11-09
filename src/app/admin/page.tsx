import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { formatPEN } from "@/lib/money";
import { createProduct } from "@/app/actions";
import { ActionForm, Field } from "@/components/ActionForm";
import { SubmitButton } from "@/components/SubmitButton";
import { StockBadge } from "@/components/StockBadge";

export const metadata: Metadata = { title: "Administrar productos" };

// ⚠️ Sin control de acceso, a pedido para la demo: cualquiera que abra /admin puede cargar productos.

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Administrar productos</h1>
      <p className="mt-1 text-sm text-zinc-500">Los productos nuevos aparecen al instante en el catálogo.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-2xl bg-white p-5 ring-1 ring-zinc-200 sm:p-6">
          <h2 className="mb-4 font-semibold">Nuevo producto</h2>
          <ActionForm action={createProduct}>
            <Field label="Nombre" name="name" required placeholder='Laptop Nova 15"' />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Descripción</span>
              <textarea
                name="description"
                rows={3}
                placeholder="Características principales…"
                className="w-full rounded-xl border-0 px-4 py-3 text-base ring-1 ring-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Precio (S/)" name="price" required inputMode="decimal" placeholder="1299.90" />
              <Field label="Stock" name="stock" type="number" required min={0} step={1} placeholder="10" />
            </div>
            <Suspense fallback={<Field label="Categoría" name="category" required />}>
              <CategoryField />
            </Suspense>
            <Field label="URL de imagen (opcional)" name="image_url" type="url" placeholder="https://…" />
            <SubmitButton pendingText="Guardando…" className="h-12 w-full">
              Agregar producto
            </SubmitButton>
          </ActionForm>
        </section>

        <section className="min-w-0">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-zinc-200" />}>
            <ProductTable />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

async function CategoryField() {
  const categories = await getCategories();
  return (
    <>
      <Field label="Categoría" name="category" required list="categorias" placeholder="Laptops" />
      <datalist id="categorias">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </>
  );
}

async function ProductTable() {
  const products = await getProducts();
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h2 className="font-semibold">Catálogo ({products.length})</h2>
      </div>
      <ul className="divide-y divide-zinc-100">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
            <div className="min-w-0">
              <Link href={`/productos/${p.id}`} className="block truncate font-medium hover:text-indigo-600">
                {p.name}
              </Link>
              <span className="text-xs text-zinc-500">
                {p.category} · {p.stock} u.
              </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="font-semibold">{formatPEN(p.price_cents)}</span>
              <StockBadge stock={p.stock} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
